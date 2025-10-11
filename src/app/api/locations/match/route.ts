import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { budget, participantCount } = await request.json()

    if (!budget || !participantCount) {
      return NextResponse.json(
        { error: 'Budget und Teilnehmerzahl erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // ALLE Locations holen (kein Kapazitäts-Filter!)
    // Kapazität wird nur im Score berücksichtigt, nicht als harter Filter
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')

    if (error) {
      console.error('Location fetch error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Locations' },
        { status: 500 }
      )
    }

    // Matching-Algorithmus
    const matches = locations
      ?.map(location => {
        const totalCost = location.price_per_person * participantCount
        const budgetPerPerson = budget / participantCount
        
        // Score berechnen (0-100)
        let score = 0
        
        // 1. Preis-Match (50 Punkte) - Wichtigster Faktor!
        const priceDiff = Math.abs(budgetPerPerson - location.price_per_person)
        const priceScore = Math.max(0, 50 - (priceDiff / budgetPerPerson * 50))
        score += priceScore
        
        // 2. Kapazitäts-Match (20 Punkte) - Flexibel!
        // Kleine Teams können große Locations buchen - nur leichte Penalty
        if (participantCount >= location.capacity_min && participantCount <= location.capacity_max) {
          score += 20 // Perfekt innerhalb der Kapazität
        } else if (participantCount < location.capacity_min) {
          // Zu wenig Teilnehmer - nur kleine Penalty
          const diff = location.capacity_min - participantCount
          const penalty = Math.min(15, diff / location.capacity_min * 15)
          score += (20 - penalty)
        } else {
          // Zu viele Teilnehmer - größere Penalty
          score += 0
        }
        
        // 3. Budget passt genau (30 Punkte)
        const budgetFits = totalCost <= budget
        score += budgetFits ? 30 : 0
        
        return {
          ...location,
          match_score: Math.round(score),
          total_cost: totalCost,
          budget_per_person: budgetPerPerson,
          fits_budget: budgetFits
        }
      })
      .filter(loc => loc.match_score > 20) // Flexibler Threshold
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 8) // Top 8 statt nur 5

    return NextResponse.json({
      matches,
      total_found: matches?.length || 0
    })
  } catch (error) {
    console.error('Location matching exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
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

    // Alle Locations holen die passen
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .lte('capacity_min', participantCount)
      .gte('capacity_max', participantCount)

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
        
        // 1. Preis-Match (40 Punkte)
        const priceDiff = Math.abs(budgetPerPerson - location.price_per_person)
        const priceScore = Math.max(0, 40 - (priceDiff / budgetPerPerson * 40))
        score += priceScore
        
        // 2. Kapazitäts-Match (30 Punkte)
        const capacityMid = (location.capacity_min + location.capacity_max) / 2
        const capacityDiff = Math.abs(capacityMid - participantCount)
        const capacityScore = Math.max(0, 30 - (capacityDiff / capacityMid * 30))
        score += capacityScore
        
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
      .filter(loc => loc.match_score > 30) // Nur relevante Matches
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5) // Top 5

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
import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Fetch all available activities
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .eq('available', true)
      .order('popular', { ascending: false })
      .order('price_per_person', { ascending: true })

    if (error) {
      console.error('Activities fetch error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Activities' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      activities: activities || [],
      count: activities?.length || 0
    })
  } catch (error) {
    console.error('Activities exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
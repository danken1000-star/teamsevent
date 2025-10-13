import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Get event with location
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        locations (
          id,
          name,
          city,
          category,
          price_per_person
        )
      `)
      .eq('id', params.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event nicht gefunden' },
        { status: 404 }
      )
    }

    // Count votes for this event
    const { count: voteCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', params.id)
      .eq('vote_type', 'date')

    return NextResponse.json({
      event,
      voteCount: voteCount || 0
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
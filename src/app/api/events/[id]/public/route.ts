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

    // Load activities for this event
    const { data: eventActivities } = await supabase
      .from('event_activities')
      .select(`
        *,
        activities (
          id,
          name,
          description,
          category,
          price_per_person,
          duration_hours,
          tags
        )
      `)
      .eq('event_id', params.id)
      .order('order_index', { ascending: true })

    // Extract activities from junction
    const activities = eventActivities?.map(ea => ea.activities).filter(Boolean) || []

    return NextResponse.json({
      event,
      activities
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
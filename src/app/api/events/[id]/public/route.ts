import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: Fetching event with ID:', params.id)
    
    // Use service role for public access (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', params.id)
      .single()

    console.log('API: Event query result:', { event, eventError })

    if (eventError || !event) {
      console.log('API: Event not found, error:', eventError)
      return NextResponse.json(
        { error: 'Event nicht gefunden' },
        { status: 404 }
      )
    }

    // Get event locations
    const { data: eventLocations } = await supabase
      .from('event_locations')
      .select(`
        *,
        locations (*)
      `)
      .eq('event_id', params.id)
      .order('order_index', { ascending: true })

    const locations = eventLocations?.map(el => ({
      ...el.locations,
      start_time: el.start_time,
      order_index: el.order_index
    })).filter(Boolean) || []

    console.log('API: Returning event:', event.title, 'with', locations.length, 'locations')
    return NextResponse.json({
      event,
      locations
    })
  } catch (error) {
    console.error('API: Error fetching event:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
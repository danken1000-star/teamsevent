import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: 'Supabase config missing on server', hasUrl: !!url, hasServiceKey: !!serviceKey },
        { status: 500 }
      )
    }

    // Service-level client to bypass RLS for public read
    const supabase = createClient(url, serviceKey)

    const eventId = params.id

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Load junction first, preserve order
    const { data: junction, error: jErr } = await supabase
      .from('event_activities')
      .select('activity_id, order_index')
      .eq('event_id', eventId)
      .order('order_index', { ascending: true })

    if (jErr) {
      return NextResponse.json({ error: jErr.message }, { status: 500 })
    }

    let activities: any[] = []
    if (junction && junction.length > 0) {
      const activityIds = junction.map((j: any) => j.activity_id)
      const { data: acts, error: aErr } = await supabase
        .from('activities')
        .select('id, name, description, category, price_per_person, duration_hours')
        .in('id', activityIds)

      if (aErr) {
        return NextResponse.json({ error: aErr.message }, { status: 500 })
      }

      const idToActivity = new Map<string, any>((acts || []).map(a => [a.id, a]))
      activities = junction
        .map((j: any) => idToActivity.get(j.activity_id))
        .filter(Boolean)
    }

    return NextResponse.json({ event, activities })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    )
  }
}



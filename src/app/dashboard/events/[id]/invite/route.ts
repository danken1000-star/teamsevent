import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
    // Check if user is authenticated and owns the event
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    // Verify event ownership
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event nicht gefunden' },
        { status: 404 }
      )
    }

    // Check if email already invited
    const { data: existing } = await supabase
      .from('team_members')
      .select('id')
      .eq('event_id', params.id)
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Diese E-Mail wurde bereits eingeladen' },
        { status: 400 }
      )
    }

    // Add team member
    const { error: insertError } = await supabase
      .from('team_members')
      .insert([
        {
          event_id: params.id,
          email,
          name: name || null,
        }
      ])

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Fehler beim Einladen' },
        { status: 500 }
      )
    }

    // TODO: Send email invitation (für später mit Email Service)
    // Für jetzt: Team Member ist eingeladen, Email wird später implementiert

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Invite exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      .select('id, user_id, status, title')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event nicht gefunden' },
        { status: 404 }
      )
    }

    // Check if already finalized
    if (event.status === 'finalized') {
      return NextResponse.json(
        { error: 'Event ist bereits finalisiert' },
        { status: 400 }
      )
    }

    // Update event status to finalized
    const { error: updateError } = await supabase
      .from('events')
      .update({ 
        status: 'finalized',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Fehler beim Finalisieren' },
        { status: 500 }
      )
    }

    console.log(`Event ${params.id} finalized successfully`)
    return NextResponse.json({ 
      success: true,
      message: 'Event erfolgreich finalisiert'
    })
  } catch (error) {
    console.error('Finalize exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
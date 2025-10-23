import { createClient } from '@/lib/supabase'
import { sendVotingInvitation } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { pendingMemberIds } = await request.json()

    if (!pendingMemberIds || pendingMemberIds.length === 0) {
      return NextResponse.json(
        { error: 'Keine ausstehenden Teilnehmer gefunden' },
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

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, user_id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event nicht gefunden' },
        { status: 404 }
      )
    }

    // Get pending members
    const { data: pendingMembers, error: membersError } = await supabase
      .from('team_members')
      .select('id, name, email')
      .eq('event_id', params.id)
      .in('id', pendingMemberIds)

    if (membersError || !pendingMembers) {
      return NextResponse.json(
        { error: 'Fehler beim Laden der Teilnehmer' },
        { status: 500 }
      )
    }

    // Send reminder emails
    let successCount = 0
    const errors: string[] = []

    for (const member of pendingMembers) {
      try {
        const emailResult = await sendVotingInvitation({
          email: member.email,
          name: member.name || undefined,
          eventId: params.id,
          memberId: member.id,
          eventTitle: event.title,
        })

        if (emailResult.success) {
          successCount++
        } else {
          errors.push(`${member.email}: ${emailResult.error}`)
        }
      } catch (error) {
        errors.push(`${member.email}: Ein unerwarteter Fehler`)
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: true,
        sent: successCount,
        errors: errors.slice(0, 3), // Limit error messages
        warning: `Erinnerung an ${successCount} Teilnehmer gesendet, ${errors.length} Fehler`
      })
    }

    return NextResponse.json({ 
      success: true,
      sent: successCount,
      message: `Erinnerung an ${successCount} Teilnehmer gesendet`
    })
  } catch (error) {
    console.error('Reminder exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

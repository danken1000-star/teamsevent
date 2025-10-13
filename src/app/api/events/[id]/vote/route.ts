import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, vote_value } = await request.json()

    if (!name || !email || !vote_value) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check event exists and get participant count
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('participant_count')
      .eq('id', params.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event nicht gefunden' },
        { status: 404 }
      )
    }

    // Check current vote count
    const { count: currentVotes } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', params.id)
      .eq('vote_type', 'date')

    if ((currentVotes || 0) >= event.participant_count) {
      return NextResponse.json(
        { error: 'Maximale Anzahl an Stimmen erreicht' },
        { status: 400 }
      )
    }

    // Create or find team member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('event_id', params.id)
      .eq('email', email.toLowerCase())
      .single()

    let memberId = existingMember?.id

    if (!memberId) {
      // Create new team member
      const { data: newMember, error: memberError } = await supabase
        .from('team_members')
        .insert({
          event_id: params.id,
          name,
          email: email.toLowerCase(),
          voted_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (memberError || !newMember) {
        throw new Error('Fehler beim Erstellen des Team-Mitglieds')
      }

      memberId = newMember.id
    } else {
      // Update voted_at
      await supabase
        .from('team_members')
        .update({ voted_at: new Date().toISOString() })
        .eq('id', memberId)
    }

    // Insert vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        event_id: params.id,
        team_member_id: memberId,
        vote_type: 'date',
        vote_value
      })

    if (voteError) {
      // Check if already voted
      if (voteError.code === '23505') {
        return NextResponse.json(
          { error: 'Sie haben bereits abgestimmt' },
          { status: 400 }
        )
      }
      throw voteError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: error.message || 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
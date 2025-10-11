import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { team_member_id, vote_type, vote_value } = await request.json()

    if (!team_member_id || !vote_type || !vote_value) {
      return NextResponse.json(
        { error: 'Fehlende Parameter' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verify team member exists and belongs to this event
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .select('id, event_id')
      .eq('id', team_member_id)
      .eq('event_id', params.id)
      .single()

    if (memberError || !teamMember) {
      return NextResponse.json(
        { error: 'Team-Mitglied nicht gefunden' },
        { status: 404 }
      )
    }

    // Upsert vote (update if exists, insert if not)
    const { error: voteError } = await supabase
      .from('votes')
      .upsert(
        {
          event_id: params.id,
          team_member_id,
          vote_type,
          vote_value,
        },
        {
          onConflict: 'team_member_id,vote_type'
        }
      )

    if (voteError) {
      console.error('Vote error:', voteError)
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Stimme' },
        { status: 500 }
      )
    }

    // Update voted_at timestamp
    await supabase
      .from('team_members')
      .update({ voted_at: new Date().toISOString() })
      .eq('id', team_member_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Vote exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { vote, voterName, voterEmail } = await request.json()
    const eventId = params.id

    if (!vote || !['yes', 'no', 'abstain'].includes(vote)) {
      return NextResponse.json(
        { error: 'Invalid vote value' },
        { status: 400 }
      )
    }

    if (!voterName || !voterName.trim()) {
      return NextResponse.json(
        { error: 'Name is required for voting' },
        { status: 400 }
      )
    }

    // Use service role for public access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if this voter name has already voted (prevent duplicate votes)
    const { data: existingVotes, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('event_id', eventId)
      .eq('vote_type', 'event_approval')
      .or(`voter_name.eq.${voterName.trim()},voter_email.eq.${voterEmail || ''}`)
      .limit(1)

    if (checkError) {
      console.error('Check existing vote error:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing votes' },
        { status: 500 }
      )
    }

    if (existingVotes && existingVotes.length > 0) {
      return NextResponse.json(
        { error: 'Sie haben bereits abgestimmt' },
        { status: 400 }
      )
    }

    console.log('Creating new vote for event:', eventId, 'vote:', vote, 'voter:', voterName)
    
    // Create vote WITHOUT creating a team member
    const { data: voteData, error: insertError } = await supabase
      .from('votes')
      .insert({
        event_id: eventId,
        vote_type: 'event_approval',
        vote_value: vote,
        voter_name: voterName.trim(),
        voter_email: voterEmail || null,
        team_member_id: null  // No team member required for event approval votes
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert vote error:', insertError)
      return NextResponse.json(
        { error: 'Failed to record vote: ' + insertError.message },
        { status: 500 }
      )
    }

    console.log('Vote created successfully:', voteData)

    // Get updated vote statistics
    const { data: allVotes, error: statsError } = await supabase
      .from('votes')
      .select('vote_value')
      .eq('event_id', eventId)
      .eq('vote_type', 'event_approval')

    if (statsError) {
      console.error('Stats error:', statsError)
      return NextResponse.json({
        success: true,
        vote: voteData,
        stats: { yes: 0, no: 0, abstain: 0 }
      })
    }

    const stats = {
      yes: allVotes?.filter(v => v.vote_value === 'yes').length || 0,
      no: allVotes?.filter(v => v.vote_value === 'no').length || 0,
      abstain: allVotes?.filter(v => v.vote_value === 'abstain').length || 0
    }

    return NextResponse.json({
      success: true,
      vote: voteData,
      stats
    })

  } catch (error) {
    console.error('Vote submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: allVotes, error: votesError } = await supabase
      .from('votes')
      .select('vote_value, created_at')
      .eq('event_id', eventId)
      .eq('vote_type', 'event_approval')
      .order('created_at', { ascending: false })

    if (votesError) {
      console.error('Error fetching votes:', votesError)
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      )
    }

    const stats = {
      yes: allVotes?.filter(v => v.vote_value === 'yes').length || 0,
      no: allVotes?.filter(v => v.vote_value === 'no').length || 0,
      abstain: allVotes?.filter(v => v.vote_value === 'abstain').length || 0
    }

    return NextResponse.json({
      stats,
      votes: allVotes || []
    })

  } catch (error) {
    console.error('Vote stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

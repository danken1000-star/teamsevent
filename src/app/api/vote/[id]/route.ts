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

    // Check if this voter already voted (by email or IP)
    const voterIdentifier = voterEmail || request.ip || 'anonymous'
    
    console.log('Checking for existing vote:', { eventId, voterIdentifier })
    
    const { data: existingVote, error: existingVoteError } = await supabase
      .from('votes')
      .select('id, vote_value')
      .eq('event_id', eventId)
      .eq('voter_email', voterIdentifier)
      .single()
    
    console.log('Existing vote result:', { existingVote, existingVoteError })

    let voteData
    if (existingVote && !existingVoteError) {
      // Update existing vote
      console.log('Updating existing vote:', existingVote.id)
      const { data, error } = await supabase
        .from('votes')
        .update({
          vote_value: vote
        })
        .eq('id', existingVote.id)
        .select()
        .single()

      if (error) {
        console.error('Update vote error:', error)
        throw error
      }
      voteData = data
    } else {
      // Create new vote - simplified for existing table structure
      console.log('Creating new vote')
      const { data, error } = await supabase
        .from('votes')
        .insert({
          event_id: eventId,
          vote_type: 'event_approval',
          vote_value: vote,
          team_member_id: null // Anonymous voting
        })
        .select()
        .single()

      if (error) {
        console.error('Insert vote error:', error)
        throw error
      }
      voteData = data
    }

    // Get updated vote statistics
    const { data: allVotes } = await supabase
      .from('votes')
      .select('vote_value')
      .eq('event_id', eventId)
      .eq('vote_type', 'event_approval')

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

    // Use service role for public access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get vote statistics
    const { data: allVotes } = await supabase
      .from('votes')
      .select('vote_value, voter_name, voter_email, created_at')
      .eq('event_id', eventId)
      .eq('vote_type', 'event_approval')
      .order('created_at', { ascending: false })

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

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

    // Simplified voting - just create new vote each time
    console.log('Creating new vote for event:', eventId, 'vote:', vote)
    
    // Create a dummy team member for anonymous voting
    const { data: dummyMember, error: memberError } = await supabase
      .from('team_members')
      .insert({
        event_id: eventId,
        name: voterName || 'Anonym',
        email: voterEmail || `anonymous_${Date.now()}@temp.com`
      })
      .select()
      .single()

    if (memberError) {
      console.error('Create dummy member error:', memberError)
      return NextResponse.json(
        { error: 'Failed to create voter record: ' + memberError.message },
        { status: 500 }
      )
    }

    console.log('Created dummy member:', dummyMember)

    const { data: voteData, error: insertError } = await supabase
      .from('votes')
      .insert({
        event_id: eventId,
        vote_type: 'event_approval',
        vote_value: vote,
        team_member_id: dummyMember.id
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
      // Return vote success even if stats fail
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

    console.log('Vote stats:', stats)

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

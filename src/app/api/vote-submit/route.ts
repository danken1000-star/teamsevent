import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_id, name, email, selected_date } = body

    console.log('=== VOTE SUBMIT START ===')
    console.log('Received data:', { event_id, name, email })

    if (!event_id || !name || !email) {
      console.error('Missing fields:', { event_id, name, email })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create service role client for admin access
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
    )

    // 1. Verify event exists
    console.log('1. Checking if event exists...')
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, event_date')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      console.error('Event check error:', eventError)
      return NextResponse.json(
        { error: 'Event not found', details: eventError?.message },
        { status: 404 }
      )
    }
    console.log('Event exists:', event.id)

    // 2. Check if member exists
    console.log('2. Checking if member exists...')
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('event_id', event_id)
      .eq('email', email)
      .maybeSingle()

    let memberId

    if (existingMember) {
      memberId = existingMember.id
      console.log('Using existing member:', memberId)
    } else {
      // 3. Create new team member
      console.log('3. Creating new team member...')
      const { data: newMember, error: memberError } = await supabase
        .from('team_members')
        .insert({
          event_id,
          email,
          name,
        })
        .select()
        .single()

      if (memberError) {
        console.error('Member creation failed:', memberError)
        return NextResponse.json(
          { error: 'Failed to create team member', details: memberError.message },
          { status: 500 }
        )
      }

      memberId = newMember.id
      console.log('Created new member:', memberId)
    }

    // 4. Check if vote already exists
    console.log('4. Checking if vote exists...')
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('event_id', event_id)
      .eq('member_id', memberId)
      .maybeSingle()

    if (existingVote) {
      console.log('Vote already exists:', existingVote.id)
      return NextResponse.json({
        success: true,
        member_id: memberId,
        vote_id: existingVote.id,
        message: 'Vote already recorded',
      })
    }

    // 5. Create vote
    console.log('5. Creating vote...')
    const voteData: any = {
      event_id,
      member_id: memberId,
    }

    // Add date if provided (optional - für Multi-Date Events später)
    if (selected_date) {
      voteData.date_id = selected_date
    }

    console.log('Vote data:', voteData)

    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert(voteData)
      .select()
      .single()

    if (voteError) {
      console.error('Vote creation failed:', voteError)
      // Log deeper error information if available (driver-dependent fields)
      const ve: any = voteError as any
      if (ve?.code) console.error('Vote error code:', ve.code)
      if (ve?.details) console.error('Vote error details:', ve.details)
      if (ve?.hint) console.error('Vote error hint:', ve.hint)
      return NextResponse.json(
        { 
          error: 'Failed to create vote', 
          details: voteError.message,
          code: ve?.code,
          hint: ve?.hint
        },
        { status: 500 }
      )
    }

    console.log('Vote created successfully:', vote.id)
    console.log('=== VOTE SUBMIT SUCCESS ===')

    return NextResponse.json({
      success: true,
      member_id: memberId,
      vote_id: vote.id,
    })

  } catch (error: any) {
    console.error('=== VOTE SUBMIT ERROR ===')
    console.error('Unexpected error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Enable CORS for public access
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_id, name, email } = body

    if (!event_id || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Service-Role Client für Admin-Zugriff
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
    )

    // 1. Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // 2. Check if member already exists
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('event_id', event_id)
      .eq('email', email)
      .single()

    let memberId

    if (existingMember) {
      memberId = existingMember.id
    } else {
      // 3. Create team member
      const { data: newMember, error: memberError } = await supabase
        .from('team_members')
        .insert({
          event_id,
          email,
          name,
          status: 'confirmed',
        })
        .select()
        .single()

      if (memberError) {
        console.error('Member creation error:', memberError)
        return NextResponse.json(
          { error: 'Failed to create team member', details: memberError.message },
          { status: 500 }
        )
      }

      memberId = newMember.id
    }

    // 4. Create vote (simplified - just record participation)
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        event_id,
        team_member_id: memberId,
        vote_type: 'participation',
        vote_value: 'yes'
      })

    if (voteError) {
      console.error('Vote creation error:', voteError)
      // Don't fail if vote already exists
      if (!voteError.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Failed to record vote', details: voteError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      member_id: memberId,
    })

  } catch (error: any) {
    console.error('Vote submit error:', error)
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

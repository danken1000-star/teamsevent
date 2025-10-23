import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_id, name, email, dietary_preference, dietary_notes } = body

    console.log('=== PARTICIPATION SUBMIT START ===')
    console.log('Received data:', { event_id, name, email, dietary_preference, dietary_notes })

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
          dietary_preference: dietary_preference || null,
          dietary_notes: dietary_notes || null,
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

    // 4. Check if participation already exists
    console.log('4. Checking if participation exists...')
    const { data: existingParticipation } = await supabase
      .from('votes')
      .select('id')
      .eq('event_id', event_id)
      .eq('team_member_id', memberId)
      .maybeSingle()

    if (existingParticipation) {
      console.log('Participation already exists:', existingParticipation.id)
      return NextResponse.json({
        success: true,
        member_id: memberId,
        participation_id: existingParticipation.id,
        message: 'Participation already confirmed',
      })
    }

    // 5. Create participation confirmation
    console.log('5. Creating participation confirmation...')
    const participationData: any = {
      event_id,
      team_member_id: memberId,
      vote_type: 'attendance',
      vote_value: 'confirmed',
    }

    console.log('Participation data:', participationData)

    const { data: participation, error: participationError } = await supabase
      .from('votes')
      .insert(participationData)
      .select()
      .single()

    if (participationError) {
      console.error('Participation creation failed:', participationError)
      // Log deeper error information if available (driver-dependent fields)
      const pe: any = participationError as any
      if (pe?.code) console.error('Participation error code:', pe.code)
      if (pe?.details) console.error('Participation error details:', pe.details)
      if (pe?.hint) console.error('Participation error hint:', pe.hint)
      return NextResponse.json(
        { 
          error: 'Failed to create participation', 
          details: participationError.message,
          code: pe?.code,
          hint: pe?.hint
        },
        { status: 500 }
      )
    }

    console.log('Participation created successfully:', participation.id)
    console.log('=== PARTICIPATION SUBMIT SUCCESS ===')

    return NextResponse.json({
      success: true,
      participation_id: participation.id,
    })

  } catch (error: any) {
    console.error('=== PARTICIPATION SUBMIT ERROR ===')
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

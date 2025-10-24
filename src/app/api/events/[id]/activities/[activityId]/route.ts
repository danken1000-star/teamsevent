import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; activityId: string } }
) {
  try {
    const eventId = params.id
    const activityId = params.activityId

    console.log('DELETE /api/events/[id]/activities/[activityId]: Deleting activity', { eventId, activityId })

    // Create Supabase client
    const supabase = createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user owns this event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, user_id, status')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Check if event is finalized
    if (event.status === 'finalized') {
      return NextResponse.json(
        { error: 'Cannot delete activities from finalized event' },
        { status: 400 }
      )
    }

    // Delete from event_activities junction table
    console.log('DELETE /api/events/[id]/activities/[activityId]: Deleting from event_activities table')
    const { error: deleteError } = await supabase
      .from('event_activities')
      .delete()
      .eq('event_id', eventId)
      .eq('activity_id', activityId)

    if (deleteError) {
      console.error('DELETE /api/events/[id]/activities/[activityId]: Error deleting activity:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete activity' },
        { status: 500 }
      )
    }

    console.log('DELETE /api/events/[id]/activities/[activityId]: Activity deleted successfully')
    
    // CRITICAL: Invalidate Next.js cache for this event page
    console.log('DELETE /api/events/[id]/activities/[activityId]: Revalidating path...')
    revalidatePath(`/dashboard/events/${eventId}`)
    
    // WICHTIG: Return JSON response!
    return NextResponse.json({
      success: true,
      message: 'Activity deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/events/[id]/activities/[activityId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

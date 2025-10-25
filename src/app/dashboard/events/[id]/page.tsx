import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import EventDetailClient from './EventDetailClient'

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Fetch event data
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (eventError || !event) {
    redirect('/dashboard')
  }

  // Check if user owns this event
  if (event.user_id !== user.id) {
    redirect('/dashboard')
  }

  // Fetch team members
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('*')
    .eq('event_id', params.id)
    .order('created_at', { ascending: true })

  // Fetch event locations
  const { data: eventLocations } = await supabase
    .from('event_locations')
    .select(`
      *,
      locations (*)
    `)
    .eq('event_id', params.id)
    .order('order_index', { ascending: true })

  // Votes laden
  const { data: votes } = await supabase
    .from('votes')
    .select('*')
    .eq('event_id', params.id)

  return (
    <EventDetailClient
      event={event}
      teamMembers={teamMembers || []}
      eventLocations={eventLocations || []}
      votes={votes || []}
      user={user}
    />
  )
}
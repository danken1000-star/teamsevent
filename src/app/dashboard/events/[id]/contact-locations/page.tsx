import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import ContactLocationsForm from './ContactLocationsForm'
import SimpleFeedback from '@/components/SimpleFeedback'

export default async function ContactLocationsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Load event with activities
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) {
    redirect('/dashboard')
  }

  // Load activities
  const { data: eventActivities } = await supabase
    .from('event_activities')
    .select('activity_id')
    .eq('event_id', params.id)

  const activityIds = eventActivities?.map((ea) => ea.activity_id) || []

  let activities = []
  if (activityIds.length > 0) {
    const { data: activitiesData } = await supabase
      .from('activities')
      .select('*')
      .in('id', activityIds)
    activities = activitiesData || []
  }

  // Load team members with dietary preferences
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('name, email, dietary_preference, dietary_notes')
    .eq('event_id', params.id)
    .not('dietary_preference', 'is', null)

  // Calculate totals
  const totalCost = activities.reduce(
    (sum, a) => sum + (a.price_per_person || 0) * (event.participant_count || 0),
    0
  )
  const totalDuration = activities.reduce((sum, a) => sum + (a.duration_hours || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Locations kontaktieren</h1>
          <p className="text-gray-600">
            Senden Sie eine Anfrage an die gewählten Locations
          </p>
        </div>

        {/* Event Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Event-Übersicht</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Event:</span>
              <span className="font-semibold">{event.title}</span>
            </div>
            {event.event_date && (
              <div className="flex justify-between">
                <span className="text-gray-600">Datum:</span>
                <span className="font-semibold">
                  {new Date(event.event_date).toLocaleDateString('de-CH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Anzahl Personen:</span>
              <span className="font-semibold">{event.participant_count} Personen</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budget:</span>
              <span className="font-semibold">CHF {event.budget?.toLocaleString('de-CH')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gesamtkosten:</span>
              <span className="font-semibold text-green-600">CHF {totalCost.toLocaleString('de-CH')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dauer:</span>
              <span className="font-semibold">~{totalDuration}h</span>
            </div>
          </div>

          {/* Activities */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Gewählte Activities:</h3>
            <ul className="space-y-2">
              {activities.map((activity) => (
                <li key={activity.id} className="flex justify-between text-sm">
                  <span>• {activity.name}</span>
                  <span className="text-gray-600">
                    CHF {(activity.price_per_person * event.participant_count).toLocaleString('de-CH')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <ContactLocationsForm
          event={event}
          activities={activities}
          totalCost={totalCost}
          totalDuration={totalDuration}
          teamMembers={teamMembers || []}
          eventId={params.id}
        />
      </div>
    </div>
  )
}

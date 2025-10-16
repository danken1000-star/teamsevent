import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import InviteTeamMembers from './InviteTeamMembers'
import Link from 'next/link'
import EventCreatedToast from './EventCreatedToast'
import CopyLinkButton from './CopyLinkButton'
import FinalizeEventButton from './FinalizeEventButton'

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍔 Essen',
  sport: '⚽ Sport',
  games: '🎮 Games',
  culture: '🎨 Kultur',
  wellness: '💆 Wellness',
  outdoor: '🏔️ Outdoor',
  creative: '✨ Kreativ'
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  
  // User-Check
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }
  
  // Event Details laden
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (eventError || !event) {
    redirect('/dashboard')
  }

  // Activities laden (via Junction Table)
  const { data: eventActivities } = await supabase
    .from('event_activities')
    .select(`
      *,
      activities (
        id,
        name,
        description,
        category,
        price_per_person,
        duration_hours,
        tags
      )
    `)
    .eq('event_id', params.id)
    .order('order_index', { ascending: true })

  // Team Members laden
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('*')
    .eq('event_id', params.id)
    .order('created_at', { ascending: true })

  // Votes laden
  const { data: votes } = await supabase
    .from('votes')
    .select('*')
    .eq('event_id', params.id)

  // Calculate vote statistics
  const voteCount = votes?.length || 0
  const memberCount = teamMembers?.length || 0

  // Extract activities from junction
  const activities = eventActivities?.map(ea => ea.activities).filter(Boolean) || []

  // Calculate totals
  const totalCost = activities.reduce(
    (sum, activity) => sum + (activity.price_per_person * event.participant_count),
    0
  )
  const costPerPerson = activities.length > 0 ? totalCost / event.participant_count : 0
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration_hours, 0)

  return (
    <div className="max-w-5xl mx-auto">
      <EventCreatedToast />

      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link 
          href="/dashboard"
          className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
        >
          ← Zurück zum Dashboard
        </Link>
      </div>

      {/* Event Header */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
              {event.title}
            </h1>
            
            {/* Event-Typ Badge */}
            {event.event_type && (
              <div className="mb-2 sm:mb-3">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800">
                  📋 {event.event_type}
                </span>
              </div>
            )}
            
            {/* Copy Vote Link Button */}
            <div className="mb-3">
              <CopyLinkButton eventId={params.id} />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span>💰 CHF {event.budget?.toLocaleString('de-CH')}</span>
              <span>👥 {event.participant_count} Teilnehmer</span>
              {event.event_date && (
                <span>📅 {new Date(event.event_date).toLocaleDateString('de-CH')}</span>
              )}
            </div>
          </div>
          
          {/* Status & Finalize Button */}
          <div className="flex flex-col gap-2 self-start">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize text-center ${
              event.status === 'finalized' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {event.status === 'finalized' ? '✓ Finalisiert' : event.status || 'planning'}
            </span>
            
            <FinalizeEventButton 
              eventId={params.id} 
              currentStatus={event.status || 'planning'} 
            />
          </div>
        </div>

        {/* Activities Section */}
        {activities.length > 0 ? (
          <div className="space-y-4">
            {/* Budget Overview */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Gesamtkosten</p>
                  <p className="text-lg font-bold text-gray-900">
                    CHF {totalCost.toLocaleString('de-CH')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Pro Person</p>
                  <p className="text-lg font-bold text-gray-900">
                    CHF {Math.round(costPerPerson)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Gesamtdauer</p>
                  <p className="text-lg font-bold text-gray-900">
                    ~{totalDuration}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Budget-Status</p>
                  {totalCost <= event.budget ? (
                    <span className="inline-flex items-center text-sm font-bold text-green-600">
                      ✓ Im Budget
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm font-bold text-red-600">
                      ⚠️ Über Budget
                    </span>
                  )}
                </div>
              </div>
              {totalCost <= event.budget && (
                <p className="text-xs text-gray-600 mt-3">
                  💰 Verfügbares Budget: CHF {(event.budget - totalCost).toLocaleString('de-CH')}
                </p>
              )}
            </div>

            {/* Contact Locations Button - Only for finalized events */}
            {event.status === 'finalized' && (
              <div className="mb-8">
                <Link
                  href={`/dashboard/events/${event.id}/contact-locations`}
                  className="w-full inline-flex items-center justify-center bg-red-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
                >
                  📧 Locations kontaktieren
                </Link>
              </div>
            )}


            {/* Activities List */}
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3">
                🎯 Gewählte Activities ({activities.length})
              </p>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-red-300 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            {index + 1}. {activity.name}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {CATEGORY_LABELS[activity.category] || activity.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>⏱️ {activity.duration_hours}h</span>
                          <span>👥 {event.participant_count} Personen</span>
                          {activity.tags && activity.tags.length > 0 && (
                            <span className="flex gap-1">
                              {activity.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-base sm:text-lg text-gray-900">
                          CHF {(activity.price_per_person * event.participant_count).toLocaleString('de-CH')}
                        </p>
                        <p className="text-xs text-gray-600">
                          CHF {activity.price_per_person} / Person
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800">
              ⚠️ Keine Activities ausgewählt für dieses Event
            </p>
          </div>
        )}
      </div>

      {/* Team Members & Voting - Stack on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Team Members */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Team-Mitglieder
          </h2>
          
          {teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-2 mb-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {member.name || member.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                  {member.voted_at ? (
                    <span className="text-xs text-green-600 font-medium whitespace-nowrap">✓ Abgestimmt</span>
                  ) : (
                    <span className="text-xs text-gray-400 whitespace-nowrap">Ausstehend</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Noch keine Team-Mitglieder eingeladen
            </p>
          )}

          <InviteTeamMembers eventId={params.id} />
        </div>

        {/* Voting Results - UPDATED */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Abstimmungs-Ergebnisse</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Abstimmungs-Fortschritt</span>
              <span className="text-lg font-bold text-red-600">
                {voteCount} / {memberCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-600 h-3 rounded-full transition-all"
                style={{
                  width: `${memberCount > 0 ? (voteCount / memberCount) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-green-600">
                {memberCount > 0 ? Math.round((voteCount / memberCount) * 100) : 0}%
              </span>
              <span className="text-sm text-gray-600 ml-2">Beteiligung</span>
            </div>
          </div>

          {voteCount > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Abgegebene Stimmen:</h4>
              {votes?.map((vote) => {
                const member = teamMembers?.find((m) => m.id === vote.team_member_id);
                return (
                  <div
                    key={vote.id}
                    className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                  >
                    <span className="text-green-600 text-lg">✓</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {member?.name || 'Unbekannt'}
                      </div>
                      <div className="text-xs text-gray-500">{member?.email}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">Noch keine Abstimmungen vorhanden</p>
              <p className="text-sm text-gray-400">
                Warten Sie bis Team-Mitglieder abgestimmt haben
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import InviteTeamMembersBulk from './InviteTeamMembersBulk'
import EditableEventTitle from './EditableEventTitle'
import SendReminderButton from './SendReminderButton'
import JoinAsOrganizerButton from './JoinAsOrganizerButton'
import Link from 'next/link'
import EventCreatedToast from './EventCreatedToast'
import FinalizeEventButton from './FinalizeEventButton'
import ActivityDeleteButton from './ActivityDeleteButton'

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

  // Group dietary preferences for overview
  const dietaryGroups: { [key: string]: any[] } = {}
  teamMembers?.forEach(member => {
    if (member.dietary_preference) {
      const pref = member.dietary_preference
      if (!dietaryGroups[pref]) {
        dietaryGroups[pref] = []
      }
      dietaryGroups[pref].push(member)
    }
  })

  // Votes laden
  const { data: votes } = await supabase
    .from('votes')
    .select('*')
    .eq('event_id', params.id)

  // Calculate vote statistics
  const confirmedVotes = votes?.filter((v: any) => v.vote_value === 'confirmed') || []
  const declinedVotes = votes?.filter((v: any) => v.vote_value === 'declined') || []
  const totalResponses = confirmedVotes.length + declinedVotes.length
  const memberCount = teamMembers?.length || 0

  // Compute which team members have responded (by team_member_id)
  const respondedMemberIds = new Set((votes || []).map((v: any) => v.team_member_id))
  const pendingMembers = teamMembers?.filter(member => !respondedMemberIds.has(member.id)) || []

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
            <EditableEventTitle 
              eventId={params.id}
              title={event.title}
              isFinalized={event.status === 'finalized'}
            />
            
            {/* Event-Typ Badge */}
            {event.event_type && (
              <div className="mb-2 sm:mb-3">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800">
                  📋 {event.event_type}
                </span>
              </div>
            )}
            
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span>💰 CHF {event.budget?.toLocaleString('de-CH')}</span>
              <span>👥 {event.participant_count} Teilnehmer</span>
              {event.event_date && (
                <span>📅 {new Date(event.event_date).toLocaleDateString('de-CH')}</span>
              )}
            </div>
          </div>
          
          {/* Status & Action Buttons */}
          <div className="flex flex-col gap-2 self-start">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize text-center ${
              event.status === 'finalized' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {event.status === 'finalized' ? '✓ Finalisiert' : event.status || 'planning'}
            </span>
            
            {/* Voting Button - ganz simpel! */}
            <a
              href={`/vote/${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block text-center text-sm"
            >
              Team abstimmen lassen
            </a>
            
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
                {eventActivities?.map((ea, index) => (
                  <div 
                    key={ea.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-red-300 transition-colors relative"
                  >
                    {/* Delete Button - NUR wenn Event NICHT finalisiert */}
                    <ActivityDeleteButton
                      eventId={params.id}
                      eventActivityId={ea.id}
                      activityName={ea.activities.name}
                      isVisible={event.status !== 'finalized'}
                    />

                    <div className="flex justify-between items-start gap-3 pr-8">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            {index + 1}. {ea.activities.name}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {CATEGORY_LABELS[ea.activities.category] || ea.activities.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                          {ea.activities.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>⏱️ {ea.activities.duration_hours}h</span>
                          <span>👥 {event.participant_count} Personen</span>
                          {ea.activities.tags && ea.activities.tags.length > 0 && (
                            <span className="flex gap-1">
                              {ea.activities.tags.slice(0, 3).map((tag: string) => (
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
                          CHF {(ea.activities.price_per_person * event.participant_count).toLocaleString('de-CH')}
                        </p>
                        <p className="text-xs text-gray-600">
                          CHF {ea.activities.price_per_person} / Person
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

      {/* Team Members & Participation - Layout like in the image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: Team Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Team
          </h2>
          
          {/* Team-Mitglieder Liste */}
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
                  {respondedMemberIds.has(member.id) ? (
                    (() => {
                      const vote = votes?.find((v: any) => v.team_member_id === member.id)
                      return vote?.vote_value === 'confirmed' ? (
                        <span className="text-xs text-green-600 font-medium whitespace-nowrap">✓ Teilnahme bestätigt</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium whitespace-nowrap">❌ Abgesagt</span>
                      )
                    })()
                  ) : (
                    <span className="text-xs text-gray-400 whitespace-nowrap">Ausstehend</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Noch keine Teammitglieder eingeladen
            </p>
          )}

          {/* Auch am Event teilnehmen - IM GLEICHEN KASTEN! */}
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Auch am Event teilnehmen
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Teilnahme als Eventplaner bestätigen.
              </p>
              <JoinAsOrganizerButton 
                eventId={params.id} 
                userEmail={user.email || ''} 
                userName={user.user_metadata?.full_name || user.user_metadata?.name}
              />
            </div>
          </div>

          {/* Bulk Invite Button */}
          <div className="mt-4">
            <InviteTeamMembersBulk eventId={params.id} />
          </div>

          {/* Send Reminder - nur wenn Team vorhanden */}
          {teamMembers && teamMembers.length > 0 && (
            <div className="mt-2">
              <SendReminderButton eventId={params.id} pendingMembers={pendingMembers} />
            </div>
          )}
        </div>

        {/* Right Column: Teilnahme Übersicht */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Teilnahme</h2>

          {/* Rückmeldungen Counter */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Rückmeldungen</span>
              <span className="text-2xl font-bold">
                {totalResponses} / {memberCount}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ 
                  width: `${memberCount > 0 
                    ? ((totalResponses) / memberCount * 100) 
                    : 0}%` 
                }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-1">
              {memberCount > 0 
                ? Math.round((totalResponses) / memberCount * 100)
                : 0}% Rückmeldungen
            </div>
          </div>

          {/* Zusagen / Absagen Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {confirmedVotes.length}
              </div>
              <div className="text-sm text-green-700 mt-1">Zusagen</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {declinedVotes.length}
              </div>
              <div className="text-sm text-red-700 mt-1">Absagen</div>
            </div>
          </div>

          {/* Detaillierte Teilnahme-Liste */}
          {teamMembers && teamMembers.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700 mb-3">Details</h3>
              {teamMembers.map((member) => {
                const vote = votes?.find((v: any) => v.team_member_id === member.id)
                const hasVoted = vote !== undefined
                const isConfirmed = hasVoted && vote.vote_value === 'confirmed'
                const isDeclined = hasVoted && vote.vote_value === 'declined'

                return (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm">{member.name || member.email}</span>
                    <span className="text-sm">
                      {isConfirmed && (
                        <span className="text-green-600 font-medium">✓ Zusage</span>
                      )}
                      {isDeclined && (
                        <span className="text-red-600 font-medium">✗ Absage</span>
                      )}
                      {!hasVoted && (
                        <span className="text-gray-400">○ Ausstehend</span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {(!teamMembers || teamMembers.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <p>Noch keine Team-Mitglieder eingeladen</p>
            </div>
          )}
        </div>
      </div>

      {/* Ernährungsübersicht */}
      {Object.keys(dietaryGroups).length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            🍽️ Ernährungspräferenzen
          </h2>
          
          <div className="space-y-3">
            {Object.entries(dietaryGroups).map(([preference, members]) => {
              const prefLabel = {
                'omnivor': '🍖 Omnivor (Alles)',
                'vegetarisch': '🥗 Vegetarisch',
                'vegan': '🌱 Vegan',
                'kein_schweinefleisch': '🐷 Kein Schweinefleisch',
                'sonstiges': '⚠️ Sonstiges'
              }[preference] || preference

              return (
                <div key={preference} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">{prefLabel}</span>
                    <span className="text-xs text-gray-500">{members.length} Person{members.length !== 1 ? 'en' : ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member) => (
                      <span key={member.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {member.name || member.email}
                      </span>
                    ))}
                  </div>
                  {preference === 'sonstiges' && members.some(m => m.dietary_notes) && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-600 mb-1">Zusätzliche Notizen:</p>
                      {members.filter(m => m.dietary_notes).map((member) => (
                        <div key={member.id} className="text-xs text-gray-700 mb-1">
                          <strong>{member.name || member.email}:</strong> {member.dietary_notes}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
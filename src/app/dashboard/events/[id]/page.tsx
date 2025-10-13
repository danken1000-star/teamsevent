import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import InviteTeamMembers from './InviteTeamMembers'
import VotingResults from './VotingResults'
import Link from 'next/link'
import EventCreatedToast from './EventCreatedToast'
import CopyLinkButton from './CopyLinkButton'

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
    .select(`
      *,
      locations (
        id,
        name,
        city,
        category,
        price_per_person,
        capacity_min,
        capacity_max
      )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (eventError || !event) {
    redirect('/dashboard')
  }

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
          <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 capitalize self-start">
            {event.status || 'planning'}
          </span>
        </div>

        {/* Location Info */}
        {event.locations && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mt-4">
            <p className="text-xs sm:text-sm font-medium text-blue-900 mb-2">📍 Gewählte Location</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm sm:text-base text-gray-900 truncate">{event.locations.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{event.locations.city}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {event.locations.category}
                  </span>
                  <span className="text-xs text-gray-600">
                    CHF {event.locations.price_per_person}/Person
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Gesamtkosten</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  CHF {(event.locations.price_per_person * event.participant_count).toLocaleString('de-CH')}
                </p>
              </div>
            </div>
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

        {/* Voting Results */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Abstimmungs-Ergebnisse
          </h2>
          
          <VotingResults 
            eventId={params.id}
            votes={votes || []}
            teamMembers={teamMembers || []}
          />
        </div>
      </div>
    </div>
  )
}
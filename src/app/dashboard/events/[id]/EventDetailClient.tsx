'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import InviteTeamMembersBulk from './InviteTeamMembersBulk'
import EditableEventTitle from './EditableEventTitle'
import SendReminderButton from './SendReminderButton'
import Link from 'next/link'
import EventCreatedToast from './EventCreatedToast'
import FinalizeEventButton from './FinalizeEventButton'
import ActivityDeleteButton from './ActivityDeleteButton'
import VoteStatsDisplay from './VoteStatsDisplay'
import OrganizerJoinModal from './OrganizerJoinModal'

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍔 Essen',
  sport: '⚽ Sport',
  games: '🎮 Games',
  culture: '🎨 Kultur',
  wellness: '💆 Wellness',
  outdoor: '🏔️ Outdoor',
  creative: '✨ Kreativ'
}

interface EventDetailClientProps {
  event: any
  teamMembers: any[]
  eventActivities: any[]
  votes: any[]
  user: any
}

export default function EventDetailClient({
  event,
  teamMembers,
  eventActivities,
  votes,
  user
}: EventDetailClientProps) {
  const [showOrganizerModal, setShowOrganizerModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Load user email
  useEffect(() => {
    const loadUserEmail = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    loadUserEmail()
  }, [])

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

  // Check if organizer has joined
  const hasOrganizerJoined = teamMembers?.some(member => member.email === user.email) || false
  const costPerPerson = activities.length > 0 ? totalCost / event.participant_count : 0
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration_hours, 0)

  // Group team members by dietary preference
  const dietaryGroups: Record<string, any[]> = {}
  teamMembers?.forEach(member => {
    if (member.dietary_preference) {
      const pref = member.dietary_preference
      if (!dietaryGroups[pref]) {
        dietaryGroups[pref] = []
      }
      dietaryGroups[pref].push(member)
    }
  })

  return (
    <div className="max-w-5xl mx-auto">
      {/* Event Created Toast */}
      <EventCreatedToast />

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <EditableEventTitle 
              eventId={event.id} 
              title={event.title}
              isFinalized={event.status === 'finalized'}
            />
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">
                📅 {new Date(event.event_date).toLocaleDateString('de-CH')}
              </span>
              <span className="text-sm text-gray-600">
                👥 {event.participant_count} Personen
              </span>
              {event.budget && (
                <span className="text-sm text-gray-600">
                  💰 CHF {event.budget.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Action Buttons - Vertikal angeordnet */}
          <div className="flex flex-col gap-3 w-full lg:w-80">
            {/* Planning Badge */}
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
              event.status === 'finalized' 
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {event.status === 'finalized' ? '✓ Finalisiert' : event.status || 'planning'}
            </span>
            
            {/* Team abstimmen Button */}
            <a
              href={`/vote/${event.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
            >
              Team abstimmen lassen
            </a>
            
            {/* Vote Stats anzeigen */}
            <VoteStatsDisplay eventId={event.id} />
            
            {/* Finalize Button */}
            <div className="w-full">
              <FinalizeEventButton 
                eventId={event.id} 
                currentStatus={event.status || 'planning'} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="mt-6 mb-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Activities</h2>
        
        {/* Activities List */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3">
            🎯 Gewählte Activities ({activities.length})
          </p>
          <div className="space-y-3">
            {eventActivities?.map((ea, index) => (
              <div 
                key={ea.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-red-300 transition-colors relative group"
              >
                {/* Delete Button - NUR wenn Event NICHT finalisiert */}
                <ActivityDeleteButton
                  eventId={event.id}
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

        {/* Cost Summary */}
        {activities.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Gesamtkosten:</span>
              <span className="text-xl font-bold text-gray-900">
                CHF {totalCost.toLocaleString('de-CH')}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              CHF {costPerPerson.toFixed(2)} pro Person • {totalDuration}h Gesamtdauer
            </div>
          </div>
        )}

        {/* Add Activity Button */}
        {event.status !== 'finalized' && (
          <div className="mt-4">
            <Link
              href={`/dashboard/events/${event.id}/contact-locations`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Activity hinzufügen
            </Link>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Team Section */}
        <div className="bg-white rounded-lg shadow p-6">
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

          {/* Auch am Event teilnehmen - NUR 1 BOX! */}
          <div className="pt-4 border-t border-gray-200 mt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Auch am Event teilnehmen
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Teilnahme als Eventplaner bestätigen.
              </p>
              
              {/* Button öffnet Modal */}
              <button
                onClick={() => setShowOrganizerModal(true)}
                disabled={hasOrganizerJoined}
                className={`
                  w-full px-4 py-2 rounded-lg font-medium transition-colors
                  ${hasOrganizerJoined
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {hasOrganizerJoined ? '✓ Teilnahme bestätigt' : 'Teilnehmen'}
              </button>
            </div>
          </div>

          {/* Team Management Buttons */}
          <div className="pt-4 border-t border-gray-200 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Team verwalten</h3>
            
            {/* Bulk Invite Button */}
            <div className="mb-3">
              <InviteTeamMembersBulk eventId={event.id} />
            </div>

            {/* Send Reminder - nur wenn Team vorhanden */}
            {teamMembers && teamMembers.length > 0 && (
              <div>
                <SendReminderButton eventId={event.id} pendingMembers={pendingMembers} />
              </div>
            )}
          </div>
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

      {/* Dietary Preferences Section */}
      {Object.keys(dietaryGroups).length > 0 && (
        <div className="mt-6 mb-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Ernährungspräferenzen</h2>
          <div className="space-y-3">
            {Object.entries(dietaryGroups).map(([preference, members]) => (
              <div key={preference} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 min-w-0 flex-shrink-0">
                  {preference === 'vegetarian' && '🥗 Vegetarisch'}
                  {preference === 'vegan' && '🌱 Vegan'}
                  {preference === 'gluten_free' && '🌾 Glutenfrei'}
                  {preference === 'lactose_free' && '🥛 Laktosefrei'}
                  {preference === 'halal' && '🕌 Halal'}
                  {preference === 'kosher' && '✡️ Kosher'}
                  {preference === 'other' && '⚠️ Andere'}
                  {!['vegetarian', 'vegan', 'gluten_free', 'lactose_free', 'halal', 'kosher', 'other'].includes(preference) && preference}
                </span>
                <span className="text-sm text-gray-600">
                  ({members.length} {members.length === 1 ? 'Person' : 'Personen'})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organizer Join Modal */}
      {showOrganizerModal && userEmail && (
        <OrganizerJoinModal
          eventId={event.id}
          userEmail={userEmail}
          onClose={() => setShowOrganizerModal(false)}
        />
      )}
    </div>
  )
}

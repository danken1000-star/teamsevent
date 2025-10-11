import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import VotingForm from './VotingForm'

export default async function PublicVotingPage({
  params,
}: {
  params: { eventId: string; memberId: string }
}) {
  const supabase = createClient()
  
  // Team Member laden MIT Event-Details über Relation
  // Das umgeht RLS auf events Tabelle - team_members ist öffentlich lesbar!
  const { data: teamMember, error: memberError } = await supabase
    .from('team_members')
    .select(`
      *,
      events (
        *,
        locations (
          id,
          name,
          city,
          category,
          price_per_person
        )
      )
    `)
    .eq('id', params.memberId)
    .eq('event_id', params.eventId)
    .single()

  if (memberError || !teamMember || !teamMember.events) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zugriff verweigert</h1>
          <p className="text-gray-600">Sie sind nicht zu diesem Event eingeladen oder der Link ist ungültig.</p>
        </div>
      </div>
    )
  }

  // Event aus der Relation extrahieren
  const event = teamMember.events as any

  // Check if already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('team_member_id', params.memberId)
    .eq('vote_type', 'date')
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <span className="text-2xl font-bold text-red-600">TeamsEvent</span>
          <span className="text-2xl font-bold text-gray-900">.ch</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {event.title}
          </h1>
          <p className="text-gray-600 mb-4">
            Hallo {teamMember.name || teamMember.email}! Bitte stimmen Sie über das Event-Datum ab.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>💰 CHF {event.budget?.toLocaleString('de-CH')}</span>
            <span>👥 {event.participant_count} Teilnehmer</span>
          </div>

          {event.locations && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">📍 Location</p>
              <p className="font-bold text-gray-900">{event.locations.name}</p>
              <p className="text-sm text-gray-600">{event.locations.city}</p>
            </div>
          )}
        </div>

        {/* Voting Form */}
        {existingVote ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Vielen Dank für Ihre Stimme!
            </h2>
            <p className="text-gray-600">
              Sie haben bereits abgestimmt. Der Event-Organisator wird Sie informieren sobald alle Stimmen eingegangen sind.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Ihre Stimme: {new Date(existingVote.vote_value).toLocaleDateString('de-CH')}
            </p>
          </div>
        ) : (
          <VotingForm
            eventId={params.eventId}
            memberId={params.memberId}
            currentDate={event.event_date}
          />
        )}
      </div>
    </div>
  )
}
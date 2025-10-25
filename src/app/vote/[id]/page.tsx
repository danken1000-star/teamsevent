'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function SimpleVotePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [event, setEvent] = useState<any>(null)
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | 'abstain' | null>(null)
  const [voteStats, setVoteStats] = useState({ yes: 0, no: 0, abstain: 0 })
  const [voterName, setVoterName] = useState('')
  const [voterEmail, setVoterEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadEvent()
    loadVoteStats()
  }, [params.id])

  const loadEvent = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, budget, participant_count')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setEvent(data)

      // Load locations for this event
      const { data: eventLocations } = await supabase
        .from('event_locations')
        .select(`
          *,
          locations (*)
        `)
        .eq('event_id', params.id)
        .order('order_index', { ascending: true })

      if (eventLocations) {
        const locs = eventLocations.map(el => ({
          ...el.locations,
          start_time: el.start_time,
          order_index: el.order_index
        })).filter(Boolean)
        setLocations(locs)
      }
    } catch (error) {
      console.error('Error loading event:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load vote statistics from API
  const loadVoteStats = async () => {
    try {
      const response = await fetch(`/api/vote/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setVoteStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading vote stats:', error)
    }
  }

  const handleVote = async (vote: 'yes' | 'no' | 'abstain') => {
    if (!voterName.trim()) {
      alert('Bitte geben Sie Ihren Namen ein')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/vote/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vote,
          voterName: voterName.trim(),
          voterEmail: voterEmail.trim() || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abstimmen')
      }

      // Update state
      setSelectedVote(vote)
      setVoteStats(data.stats)
    } catch (error) {
      console.error('Vote error:', error)
      alert(error instanceof Error ? error.message : 'Fehler beim Abstimmen')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Lädt...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Event nicht gefunden</h1>
          <p className="text-gray-600">Dieses Event existiert nicht oder wurde gelöscht.</p>
        </div>
      </div>
    )
  }

  if (selectedVote) {
    // Success State
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            {selectedVote === 'yes' && (
              <div className="text-6xl mb-4">✓</div>
            )}
            {selectedVote === 'no' && (
              <div className="text-6xl mb-4">✗</div>
            )}
            {selectedVote === 'abstain' && (
              <div className="text-6xl mb-4">○</div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-4">
            Danke für deine Stimme!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Du hast abgestimmt: 
          </p>
          <p className="text-lg font-medium mb-6">
            {selectedVote === 'yes' && '✓ Ja'}
            {selectedVote === 'no' && '✗ Nein'}
            {selectedVote === 'abstain' && '○ Enthalte mich'}
          </p>

          {/* Show current stats */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Aktueller Stand:</p>
            <div className="flex justify-around text-sm">
              <div>
                <div className="text-green-600 font-bold">{voteStats.yes}</div>
                <div className="text-gray-600">Ja</div>
              </div>
              <div>
                <div className="text-red-600 font-bold">{voteStats.no}</div>
                <div className="text-gray-600">Nein</div>
              </div>
              <div>
                <div className="text-gray-600 font-bold">{voteStats.abstain}</div>
                <div className="text-gray-600">Enthalte</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedVote(null)}
            className="text-blue-600 hover:underline"
          >
            Stimme ändern
          </button>
        </div>
      </div>
    )
  }

  // Voting Form
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">🎉 {event.title}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
            <div>
              <div className="text-gray-600">Datum</div>
              <div className="font-medium">
                {new Date(event.event_date).toLocaleDateString('de-CH')}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Teilnehmer</div>
              <div className="font-medium">👥 {event.participant_count}</div>
            </div>
            {event.budget && (
              <div>
                <div className="text-gray-600">Budget</div>
                <div className="font-medium">CHF {event.budget.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Locations */}
          {locations.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Gewählte Locations ({locations.length})
              </h3>
              <div className="space-y-2">
                {locations.map((location, index) => (
                  <div key={location.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {index + 1}. {location.name}
                        </span>
                        <span className="text-xs text-gray-500">📍 {location.city}</span>
                      </div>
                      {location.start_time && (
                        <span className="text-xs text-gray-600">🕐 {location.start_time} Uhr</span>
                      )}
                    </div>
                    {location.price_per_person && (
                      <div className="mt-1 text-xs text-gray-600">
                        CHF {location.price_per_person} / Person
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Voting Options */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-center">
            Soll dieses Event stattfinden?
          </h2>
          
          {/* Voter Information */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ihr Name *
              </label>
              <input
                type="text"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                placeholder="Max Muster"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail (optional)
              </label>
              <input
                type="email"
                value={voterEmail}
                onChange={(e) => setVoterEmail(e.target.value)}
                placeholder="max@firma.ch"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Ja */}
            <button
              onClick={() => handleVote('yes')}
              disabled={submitting}
              className="w-full p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">✓</div>
                  <div>
                    <div className="text-xl font-bold text-green-700">Ja</div>
                    <div className="text-sm text-gray-600">Event durchführen</div>
                  </div>
                </div>
                <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </button>

            {/* Nein */}
            <button
              onClick={() => handleVote('no')}
              disabled={submitting}
              className="w-full p-6 border-2 border-red-500 rounded-lg hover:bg-red-50 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">✗</div>
                  <div>
                    <div className="text-xl font-bold text-red-700">Nein</div>
                    <div className="text-sm text-gray-600">Event absagen</div>
                  </div>
                </div>
                <div className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </button>

            {/* Enthalte mich */}
            <button
              onClick={() => handleVote('abstain')}
              disabled={submitting}
              className="w-full p-6 border-2 border-gray-400 rounded-lg hover:bg-gray-50 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">○</div>
                  <div>
                    <div className="text-xl font-bold text-gray-700">Enthalte mich</div>
                    <div className="text-sm text-gray-600">Keine Meinung</div>
                  </div>
                </div>
                <div className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              💡 Deine Stimme wird anonym gespeichert und zählt zum Gesamtergebnis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function SimpleVotePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | 'abstain' | null>(null)

  useEffect(() => {
    loadEvent()
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
    } catch (error) {
      console.error('Error loading event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (vote: 'yes' | 'no' | 'abstain') => {
    setSelectedVote(vote)
    // Keine Speicherung - nur UI Update!
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

          <button
            onClick={() => setSelectedVote(null)}
            className="text-blue-600 hover:underline"
          >
            Zurück zur Abstimmung
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
        </div>

        {/* Voting Options */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-center">
            Soll dieses Event stattfinden?
          </h2>
          
          <div className="space-y-4">
            {/* Ja */}
            <button
              onClick={() => handleVote('yes')}
              className="w-full p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors text-left group"
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
              className="w-full p-6 border-2 border-red-500 rounded-lg hover:bg-red-50 transition-colors text-left group"
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
              className="w-full p-6 border-2 border-gray-400 rounded-lg hover:bg-gray-50 transition-colors text-left group"
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
              💡 Deine Stimme wird nur angezeigt, nicht gespeichert
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

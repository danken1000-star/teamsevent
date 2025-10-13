'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [voteCount, setVoteCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    loadEvent()
  }, [])

  const loadEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}/public`)
      if (!res.ok) throw new Error('Event nicht gefunden')
      
      const data = await res.json()
      setEvent(data.event)
      setVoteCount(data.voteCount || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error loading event:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !selectedDate) {
      alert('Bitte füllen Sie alle Felder aus')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/events/${params.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          vote_value: selectedDate
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Fehler beim Abstimmen')
      }

      setHasVoted(true)
    } catch (error: any) {
      alert(error.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt Event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">Event nicht gefunden</h1>
          <p className="text-gray-600">Der Abstimmungs-Link ist ungültig oder das Event existiert nicht mehr.</p>
        </div>
      </div>
    )
  }

  const isLimitReached = voteCount >= event.participant_count

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <span className="text-2xl font-bold text-red-600">TeamEvent</span>
          <span className="text-2xl font-bold text-black">.ch</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Event Info Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-6">
          <h1 className="text-4xl font-bold text-black mb-4">
            {event.title}
          </h1>
          
          {event.event_type && (
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 mb-4">
              {event.event_type}
            </span>
          )}
          
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <span className="font-semibold">💰 CHF {event.budget?.toLocaleString('de-CH')}</span>
            <span className="font-semibold">👥 {event.participant_count} Teilnehmer</span>
          </div>

          {event.locations && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">📍 LOCATION</p>
              <p className="text-xl font-bold text-black">{event.locations.name}</p>
              <p className="text-gray-600">{event.locations.city}</p>
            </div>
          )}
        </div>

        {/* Voting Status */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-blue-900">Abstimmungs-Status</p>
              <p className="text-2xl font-bold text-black">{voteCount} / {event.participant_count} Stimmen</p>
            </div>
            <div className="text-right">
              {isLimitReached ? (
                <span className="text-red-600 font-bold">Limit erreicht</span>
              ) : (
                <span className="text-green-600 font-bold">{event.participant_count - voteCount} noch offen</span>
              )}
            </div>
          </div>
        </div>

        {/* Voting Form or Success */}
        {hasVoted ? (
          <div className="bg-green-50 border-2 border-green-600 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-black mb-4">
              Vielen Dank für Ihre Stimme!
            </h2>
            <p className="text-lg text-gray-600">
              Der Event-Organisator wird Sie informieren sobald alle Stimmen eingegangen sind.
            </p>
          </div>
        ) : isLimitReached ? (
          <div className="bg-red-50 border-2 border-red-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              Abstimmung geschlossen
            </h2>
            <p className="text-gray-600">
              Die maximale Anzahl an Stimmen ({event.participant_count}) wurde bereits erreicht.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-black mb-6">
              Stimmen Sie über das Event-Datum ab
            </h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ihr Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none"
                  placeholder="Max Muster"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ihre Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none"
                  placeholder="max@beispiel.ch"
                  required
                />
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ihr Wunsch-Datum *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none"
                  required
                />
                {event.event_date && (
                  <p className="text-sm text-gray-600 mt-2">
                    Vorgeschlagenes Datum: {new Date(event.event_date).toLocaleDateString('de-CH')}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Wird gesendet...' : 'Jetzt abstimmen'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
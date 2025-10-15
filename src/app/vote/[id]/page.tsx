'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function PublicVotePage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Vote form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [voteSuccess, setVoteSuccess] = useState(false)

  useEffect(() => {
    loadEventData()
  }, [params.id])

  const loadEventData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.teamsevent.ch'
      const apiUrl = `${baseUrl}/api/vote/${params.id}`
      
      const response = await fetch(apiUrl, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setEvent(data.event)
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Error loading event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoteSubmit = async () => {
    if (!name || !email) {
      alert('Bitte Name und Email eingeben')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/vote-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: params.id,
          name,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Vote error:', data)
        throw new Error(data.error || 'Failed to submit vote')
      }

      setVoteSuccess(true)
    } catch (error: any) {
      console.error('Vote submit error:', error)
      alert(`Fehler beim Vote: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt Event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event nicht gefunden</h1>
          <p className="text-gray-600 mb-4">Der Abstimmungs-Link ist ungültig oder das Event existiert nicht mehr.</p>
          <Link href="/" className="text-red-600 hover:underline">Zurück zum Start</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team-Voting</h1>
        <p className="text-gray-600 mt-1">Event: {event.title}</p>
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Budget</p>
            <p className="font-semibold">CHF {event.budget?.toLocaleString('de-CH')}</p>
          </div>
          <div>
            <p className="text-gray-600">Teilnehmer</p>
            <p className="font-semibold">{event.participant_count} Personen</p>
          </div>
        </div>
      </div>

      {/* Activities */}
      {activities.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ausgewählte Activities</h2>
          <div className="space-y-3">
            {activities.map((a: any, idx: number) => (
              <div key={a.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{idx + 1}. {a.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-nowrap ml-4">
                    CHF {a.price_per_person}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg p-4 mb-6">
          Noch keine Activities vorhanden.
        </div>
      )}

      {/* Vote Form */}
      {!voteSuccess ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Teilnahme bestätigen</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ihr Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="ihre.email@beispiel.ch"
              />
            </div>

            <button
              onClick={handleVoteSubmit}
              disabled={submitting || !name || !email}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Wird gespeichert...' : 'Teilnahme bestätigen'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-500 p-6 rounded-lg text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-700 mb-2">Teilnahme bestätigt!</h3>
          <p className="text-gray-600">Vielen Dank für Ihre Teilnahme am Event.</p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600 text-center">
        <Link href="/" className="text-red-600 hover:underline">Zurück zum Start</Link>
      </div>
    </div>
  )
}
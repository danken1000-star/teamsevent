'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ParticipatePage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [invitedMember, setInvitedMember] = useState<any>(null)
  
  // Participation form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dietaryPreference, setDietaryPreference] = useState('')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [participationSuccess, setParticipationSuccess] = useState(false)
  const [declineMode, setDeclineMode] = useState(false)

  useEffect(() => {
    loadEventData()
    loadInvitedMember()
  }, [params.id])

  const loadInvitedMember = async () => {
    try {
      // Check if there's a member parameter in URL
      const urlParams = new URLSearchParams(window.location.search)
      const memberId = urlParams.get('member')
      
      if (memberId) {
        const response = await fetch(`/api/events/${params.id}/member/${memberId}`)
        if (response.ok) {
          const member = await response.json()
          setInvitedMember(member)
          // Pre-fill form with member data
          setName(member.name || '')
          setEmail(member.email || '')
        }
      }
    } catch (error) {
      console.log('Could not load member data:', error)
    }
  }

  const loadEventData = async () => {
    try {
      console.log('Loading event for ID:', params.id)
      
      // Try multiple URLs with different approaches
      const urls = [
        `/api/events/${params.id}/public`,
        `https://www.teamsevent.ch/api/events/${params.id}/public`,
        `https://teamsevent.ch/api/events/${params.id}/public`
      ]
      
      let lastError = null
      
      for (const url of urls) {
        try {
          console.log('Trying URL:', url)
          
          const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })

          console.log('Response status for', url, ':', response.status)

          if (response.ok) {
            const data = await response.json()
            console.log('Event data received from', url, ':', data)
            
            if (data.event) {
              setEvent(data.event)
              return // Success, exit the function
            }
          } else {
            const errorText = await response.text()
            console.log('Error response from', url, ':', errorText)
            lastError = new Error(`HTTP ${response.status}: ${errorText}`)
          }
        } catch (urlError) {
          console.log('Error with URL', url, ':', urlError instanceof Error ? urlError.message : String(urlError))
          lastError = urlError instanceof Error ? urlError : new Error(String(urlError))
        }
      }
      
      // If all URLs failed, throw the last error
      if (lastError) {
        throw lastError
      }
      
    } catch (error) {
      console.error('Error loading event:', error)
      setEvent(null) // Explicitly set to null to show error state
    } finally {
      setLoading(false)
    }
  }

  const handleParticipationSubmit = async () => {
    if (!name || !email) {
      alert('Bitte Name und Email eingeben')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/participate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: params.id,
          name,
          email,
          dietary_preference: dietaryPreference,
          dietary_notes: dietaryNotes,
          participation_type: declineMode ? 'declined' : 'confirmed'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Participation error:', data)
        throw new Error(data.error || 'Failed to confirm participation')
      }

      setParticipationSuccess(true)
    } catch (error: any) {
      console.error('Participation submit error:', error)
      alert(`Fehler bei der Teilnahme-Bestätigung: ${error.message}`)
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
          <p className="text-gray-600 mb-4">Der Teilnahme-Link ist ungültig oder das Event existiert nicht mehr.</p>
          <p className="text-sm text-gray-500 mb-4">Event ID: {params.id}</p>
          <div className="mt-6 space-y-2">
            <button 
              onClick={() => {
                setLoading(true)
                loadEventData()
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Erneut versuchen
            </button>
            <div className="text-xs text-gray-500">
              Falls das Problem weiterhin besteht, wende dich an den Event-Organisator.
            </div>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-red-600 hover:underline">Zurück zum Start</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teilnahme bestätigen</h1>
        <p className="text-gray-600 mt-1">Event: {event.title}</p>
        {event.event_date && (
          <p className="text-gray-600 mt-1">
            📅 {new Date(event.event_date).toLocaleDateString('de-CH', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        )}
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Budget</p>
            <p className="font-semibold">CHF {event.budget?.toLocaleString('de-CH')}</p>
          </div>
          <div>
            <p className="text-gray-600">Teilnehmer</p>
            <p className="font-semibold">{event.participant_count} Personen</p>
          </div>
          {event.event_date && (
            <div>
              <p className="text-gray-600">Datum</p>
              <p className="font-semibold">
                {new Date(event.event_date).toLocaleDateString('de-CH', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>


      {/* Invited Member Info */}
      {invitedMember && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Eingeladene Person</h3>
          <div className="text-sm text-blue-800">
            <p><strong>Name:</strong> {invitedMember.name || 'Nicht angegeben'}</p>
            <p><strong>E-Mail:</strong> {invitedMember.email}</p>
          </div>
        </div>
      )}

      {/* Participation Form */}
      {!participationSuccess ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {declineMode ? 'Absage mitteilen' : 'Teilnahme bestätigen'}
            </h2>
            <button
              onClick={() => setDeclineMode(!declineMode)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                declineMode 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {declineMode ? '✓ Absage' : '❌ Absagen'}
            </button>
          </div>
          
          {declineMode && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">
                <strong>Absage:</strong> Du kannst an diesem Datum nicht teilnehmen? 
                Das ist völlig in Ordnung! Bitte gib deine Kontaktdaten an, damit wir Bescheid wissen.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
                placeholder="ihre.email@beispiel.ch"
              />
            </div>

            {/* Ernährungspräferenzen */}
            <div>
              <label className="block text-sm font-medium mb-2">Ernährungspräferenz (Optional)</label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 font-medium"
              >
                <option value="">Bitte wählen...</option>
                <option value="omnivor">🍖 Omnivor (Alles)</option>
                <option value="vegetarisch">🥗 Vegetarisch</option>
                <option value="vegan">🌱 Vegan</option>
                <option value="kein_schweinefleisch">🐷 Kein Schweinefleisch</option>
                <option value="sonstiges">⚠️ Sonstiges</option>
              </select>
            </div>

            {/* Zusätzliche Ernährungsnotizen */}
            {dietaryPreference === 'sonstiges' && (
              <div>
                <label className="block text-sm font-medium mb-2">Bitte beschreiben Sie Ihre Ernährungspräferenz</label>
                <textarea
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
                  placeholder="z.B. Nussallergie, Glutenunverträglichkeit, etc."
                  rows={3}
                />
              </div>
            )}

            <button
              onClick={handleParticipationSubmit}
              disabled={submitting || !name || !email}
              className={`w-full py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                declineMode 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {submitting ? 'Wird gespeichert...' : (declineMode ? 'Absage senden' : 'Teilnahme bestätigen')}
            </button>
          </div>
        </div>
      ) : (
        <div className={`border-2 p-6 rounded-lg text-center ${
          declineMode 
            ? 'bg-red-50 border-red-500' 
            : 'bg-green-50 border-green-500'
        }`}>
          <div className="text-4xl mb-4">{declineMode ? '❌' : '✅'}</div>
          <h3 className={`text-xl font-bold mb-2 ${
            declineMode ? 'text-red-700' : 'text-green-700'
          }`}>
            {declineMode ? 'Absage erhalten!' : 'Teilnahme bestätigt!'}
          </h3>
          <p className="text-gray-600">
            {declineMode 
              ? 'Vielen Dank für die Rückmeldung. Wir haben deine Absage notiert.' 
              : 'Vielen Dank für Ihre Teilnahme am Event.'
            }
          </p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600 text-center">
        <Link href="/" className="text-red-600 hover:underline">Zurück zum Start</Link>
      </div>
    </div>
  )
}

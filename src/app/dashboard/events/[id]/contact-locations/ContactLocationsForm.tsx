'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SimpleFeedback from '@/components/SimpleFeedback'

interface ContactLocationsFormProps {
  event: any
  locations: any[]
  totalCost: number
  teamMembers: any[]
  eventId: string
}

export default function ContactLocationsForm({
  event,
  locations,
  totalCost,
  teamMembers,
  eventId,
}: ContactLocationsFormProps) {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Pre-fill message template
  useEffect(() => {
    // Group dietary preferences
    const dietaryGroups: { [key: string]: string[] } = {}
    teamMembers.forEach(member => {
      if (member.dietary_preference) {
        const pref = member.dietary_preference
        if (!dietaryGroups[pref]) {
          dietaryGroups[pref] = []
        }
        dietaryGroups[pref].push(member.name || member.email)
      }
    })

    // Format dietary information
    let dietaryInfo = ''
    if (Object.keys(dietaryGroups).length > 0) {
      dietaryInfo = '\n\nErnährungspräferenzen:\n'
      Object.entries(dietaryGroups).forEach(([preference, names]) => {
        const prefLabel = {
          'omnivor': '🍖 Omnivor (Alles)',
          'vegetarisch': '🥗 Vegetarisch',
          'vegan': '🌱 Vegan',
          'kein_schweinefleisch': '🐷 Kein Schweinefleisch',
          'sonstiges': '⚠️ Sonstiges'
        }[preference] || preference

        dietaryInfo += `- ${prefLabel}: ${names.join(', ')}\n`
      })

      // Add special notes for "sonstiges"
      const sonstigesMembers = teamMembers.filter(m => m.dietary_preference === 'sonstiges' && m.dietary_notes)
      if (sonstigesMembers.length > 0) {
        dietaryInfo += '\nZusätzliche Ernährungsnotizen:\n'
        sonstigesMembers.forEach(member => {
          dietaryInfo += `- ${member.name || member.email}: ${member.dietary_notes}\n`
        })
      }
    }

    const defaultMessage = `Guten Tag,

wir möchten folgendes Event bei Ihnen buchen:

Event: ${event.title}
${event.event_date ? `Datum: ${new Date(event.event_date).toLocaleDateString('de-CH')}` : ''}
Anzahl Personen: ${event.participant_count}

Gewählte Locations:
${locations.map((loc) => `- ${loc.name}${loc.start_time ? ` (${loc.start_time} Uhr)` : ''} (CHF ${(loc.price_per_person * event.participant_count).toLocaleString('de-CH')})`).join('\n')}

Gesamtkosten: CHF ${totalCost.toLocaleString('de-CH')}${dietaryInfo}

Bitte senden Sie uns eine Bestätigung und weitere Details zur Buchung.

Mit freundlichen Grüssen
Organisiert über TeamEvent.ch`

    setMessage(defaultMessage)
  }, [event, locations, totalCost, teamMembers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate API call (MVP - no real email)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="space-y-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-3">
            Anfrage erfolgreich versendet!
          </h2>
          <p className="text-gray-600 mb-6">
            Ihr Event wurde über <strong>TeamEvent.ch</strong> organisiert.
            <br />
            Die Locations werden sich in Kürze bei Ihnen melden.
          </p>
        </div>

        {/* Feedback Component */}
        <SimpleFeedback eventId={eventId} />

        {/* Back to Dashboard Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Nachricht an Locations</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ihre Nachricht
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={16}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm text-gray-900 placeholder-gray-500"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Diese Nachricht wird an alle gewählten Locations gesendet.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>💡 MVP-Hinweis:</strong> In der finalen Version wird diese Nachricht
            automatisch per Email an die Locations versendet.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !message}
          className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Wird versendet...' : '📧 Anfrage senden'}
        </button>
      </form>
    </div>
  )
}

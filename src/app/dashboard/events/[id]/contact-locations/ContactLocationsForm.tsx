'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ContactLocationsFormProps {
  event: any
  activities: any[]
  totalCost: number
  totalDuration: number
}

export default function ContactLocationsForm({
  event,
  activities,
  totalCost,
  totalDuration,
}: ContactLocationsFormProps) {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Pre-fill message template
  useEffect(() => {
    const defaultMessage = `Guten Tag,

wir möchten folgendes Event bei Ihnen buchen:

Event: ${event.title}
${event.event_date ? `Datum: ${new Date(event.event_date).toLocaleDateString('de-CH')}` : ''}
Anzahl Personen: ${event.participant_count}

Gewählte Activities:
${activities.map((a) => `- ${a.name} (CHF ${(a.price_per_person * event.participant_count).toLocaleString('de-CH')})`).join('\n')}

Gesamtkosten: CHF ${totalCost.toLocaleString('de-CH')}
Dauer: ca. ${totalDuration} Stunden

Bitte senden Sie uns eine Bestätigung und weitere Details zur Buchung.

Mit freundlichen Grüssen
Organisiert über TeamEvent.ch`

    setMessage(defaultMessage)
  }, [event, activities, totalCost, totalDuration])

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
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
        >
          Zurück zum Dashboard
        </button>
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

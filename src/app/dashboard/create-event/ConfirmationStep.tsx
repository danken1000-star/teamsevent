'use client'

import { useState } from 'react'

type Location = {
  id: string
  name: string
  city: string
  category: string
  price_per_person: number
  capacity_min: number
  capacity_max: number
  match_score: number
  total_cost: number
  fits_budget: boolean
}

type EventData = {
  title: string
  budget: number
  participant_count: number
  event_date: string
  selectedLocation: Location | null
}

type ConfirmationStepProps = {
  eventData: EventData
  createEvent: (formData: FormData) => Promise<void>
  onBack: () => void
}

export default function ConfirmationStep({
  eventData,
  createEvent,
  onBack
}: ConfirmationStepProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', eventData.title)
      formData.append('budget', eventData.budget.toString())
      formData.append('participant_count', eventData.participant_count.toString())
      formData.append('event_date', eventData.event_date)
      if (eventData.selectedLocation) {
        formData.append('location_id', eventData.selectedLocation.id)
      }

      await createEvent(formData)
    } catch (err) {
      console.error('Create event error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen des Events')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Bestätigung
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Überprüfen Sie Ihre Event-Details vor dem Erstellen
        </p>
      </div>

      {/* Event Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {eventData.title}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-lg font-semibold text-gray-900">
              CHF {eventData.budget.toLocaleString('de-CH')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Teilnehmer</p>
            <p className="text-lg font-semibold text-gray-900">
              {eventData.participant_count} Personen
            </p>
          </div>
          {eventData.event_date && (
            <div>
              <p className="text-sm text-gray-600">Datum</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(eventData.event_date).toLocaleDateString('de-CH')}
              </p>
            </div>
          )}
        </div>

        {/* Selected Location */}
        {eventData.selectedLocation && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Gewählte Location</p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">
                    {eventData.selectedLocation.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    📍 {eventData.selectedLocation.city}
                  </p>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {eventData.selectedLocation.match_score}% Match
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Gesamtkosten:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    CHF {eventData.selectedLocation.total_cost.toLocaleString('de-CH')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Pro Person:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    CHF {eventData.selectedLocation.price_per_person}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Zurück
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '✨ Event wird erstellt...' : '✅ Event jetzt erstellen'}
        </button>
      </div>
    </form>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

interface ConfirmationStepProps {
  eventData: {
    title: string
    budget: number
    participant_count: number
    event_date: string
    location_id: string
    event_type: string
  }
  selectedLocation: any
  onBack: () => void
}

export default function ConfirmationStep({
  eventData,
  selectedLocation,
  onBack
}: ConfirmationStepProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Nicht eingeloggt')
      }

      // Create event with event_type
      const { data, error: insertError } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title: eventData.title,
          budget: eventData.budget,
          participant_count: eventData.participant_count,
          event_date: eventData.event_date || null,
          location_id: eventData.location_id || null,
          event_type: eventData.event_type || null,
          status: 'planning'
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Error creating event:', err)
      setError(err.message || 'Fehler beim Erstellen des Events')
    } finally {
      setLoading(false)
    }
  }

  const totalCost = selectedLocation 
    ? selectedLocation.price_per_person * eventData.participant_count 
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bestätigung
        </h2>
        <p className="text-gray-600">
          Prüfe deine Event-Details bevor du speicherst
        </p>
      </div>

      {/* Event Details */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg text-gray-900">Event-Details</h3>
        
        <div>
          <span className="font-medium text-gray-700">Event Name:</span>
          <p className="text-gray-900">{eventData.title}</p>
        </div>

        {eventData.event_type && (
          <div>
            <span className="font-medium text-gray-700">Event-Typ:</span>
            <p className="text-gray-900">{eventData.event_type}</p>
          </div>
        )}

        <div>
          <span className="font-medium text-gray-700">Budget:</span>
          <p className="text-gray-900">CHF {eventData.budget.toLocaleString()}</p>
        </div>

        <div>
          <span className="font-medium text-gray-700">Teilnehmer:</span>
          <p className="text-gray-900">{eventData.participant_count} Personen</p>
        </div>

        {eventData.event_date && (
          <div>
            <span className="font-medium text-gray-700">Datum:</span>
            <p className="text-gray-900">
              {new Date(eventData.event_date).toLocaleDateString('de-CH')}
            </p>
          </div>
        )}
      </div>

      {/* Location Details */}
      {selectedLocation && (
        <div className="bg-blue-50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Gewählte Location</h3>
          
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <p className="text-gray-900">{selectedLocation.name}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Stadt:</span>
            <p className="text-gray-900">{selectedLocation.city}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Kategorie:</span>
            <p className="text-gray-900">{selectedLocation.category}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Preis pro Person:</span>
            <p className="text-gray-900">CHF {selectedLocation.price_per_person}</p>
          </div>

          <div className="pt-4 border-t border-blue-200">
            <span className="font-medium text-gray-700">Gesamtkosten:</span>
            <p className="text-2xl font-bold text-blue-600">
              CHF {totalCost.toLocaleString()}
            </p>
            {totalCost <= eventData.budget ? (
              <p className="text-green-600 text-sm mt-1">✓ Im Budget</p>
            ) : (
              <p className="text-orange-600 text-sm mt-1">
                ⚠ CHF {(totalCost - eventData.budget).toLocaleString()} über Budget
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          ← Zurück
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Erstelle Event...' : 'Event jetzt erstellen ✓'}
        </button>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'

interface ConfirmationStepProps {
  eventData: {
    title: string
    budget: number
    participant_count: number
    event_date: string
    event_type: string
    location_id?: string
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const supabase = createBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Du musst angemeldet sein')
        return
      }

      // Event erstellen
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          budget: eventData.budget,
          participant_count: eventData.participant_count,
          event_date: eventData.event_date || null,
          event_type: eventData.event_type || null,
          location_id: eventData.location_id || null,
          user_id: user.id,
          status: 'planning'
        })
        .select()
        .single()

      if (eventError) throw eventError

      // 🎉 SUCCESS - Redirect zum Event mit Toast!
      router.push(`/dashboard/events/${event.id}?created=true`)
      
    } catch (err) {
      console.error('Error creating event:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event-Bestätigung</h2>
        <p className="text-gray-600">
          Überprüfe alle Details bevor du das Event erstellst.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        {/* Event Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event-Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{eventData.title}</p>
            </div>
            {eventData.event_type && (
              <div>
                <p className="text-sm text-gray-600">Typ</p>
                <p className="font-medium text-gray-900">📋 {eventData.event_type}</p>
              </div>
            )}
            {eventData.event_date && (
              <div>
                <p className="text-sm text-gray-600">Datum</p>
                <p className="font-medium text-gray-900">
                  {new Date(eventData.event_date).toLocaleDateString('de-CH')}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Teilnehmer</p>
              <p className="font-medium text-gray-900">{eventData.participant_count} Personen</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-medium text-gray-900">CHF {eventData.budget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Selected Location */}
        {selectedLocation && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ausgewählte Location
            </h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedLocation.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedLocation.city}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedLocation.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    CHF {(selectedLocation.price_per_person * eventData.participant_count).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    CHF {selectedLocation.price_per_person} / Person
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium 
                     hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium 
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Erstelle Event...
            </>
          ) : (
            <>
              Event erstellen
              <span className="text-lg">🎉</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
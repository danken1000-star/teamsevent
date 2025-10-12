'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import type { EventFormData } from './types.js'

interface ConfirmationStepProps {
  formData: EventFormData
  onBack: () => void
}

export default function ConfirmationStep({ formData, onBack }: ConfirmationStepProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Du musst angemeldet sein')
        return
      }

      // Event erstellen
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          name: formData.eventName,
          description: formData.description,
          date: formData.eventDate,
          start_time: formData.startTime,
          end_time: formData.endTime,
          budget: formData.totalBudget,
          participant_count: formData.participantCount,
          event_type: formData.eventType,
          organizer_id: user.id,
        })
        .select()
        .single()

      if (eventError) throw eventError

      // Locations hinzufügen
      if (formData.selectedLocations.length > 0) {
        const locationInserts = formData.selectedLocations.map((location) => ({
          event_id: event.id,
          name: location.name,
          address: location.address,
          price_per_person: location.pricePerPerson,
          total_price: location.totalPrice,
          capacity: location.capacity,
          ranking: location.ranking,
        }))

        const { error: locationsError } = await supabase
          .from('event_locations')
          .insert(locationInserts)

        if (locationsError) throw locationsError
      }

      // 🎉 SUCCESS - Redirect zum Event mit Toast!
      router.push(`/dashboard/events/${event.id}?created=true`)
      
    } catch (err) {
      console.error('Error creating event:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen')
    } finally {
      setIsSubmitting(false)
    }
  }

  const eventTypeBadge = formData.eventType ? (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      {formData.eventType === 'team_building' && '🤝 Team Building'}
      {formData.eventType === 'celebration' && '🎉 Feier'}
      {formData.eventType === 'workshop' && '📚 Workshop'}
      {formData.eventType === 'sports' && '⚽ Sport'}
      {formData.eventType === 'culture' && '🎭 Kultur'}
      {formData.eventType === 'outdoor' && '🏕️ Outdoor'}
      {formData.eventType === 'food_drink' && '🍽️ Essen & Trinken'}
      {formData.eventType === 'other' && '📌 Sonstiges'}
    </span>
  ) : null

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
              <p className="font-medium text-gray-900">{formData.eventName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Typ</p>
              <div>{eventTypeBadge}</div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Datum</p>
              <p className="font-medium text-gray-900">
                {new Date(formData.eventDate).toLocaleDateString('de-CH')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Zeit</p>
              <p className="font-medium text-gray-900">
                {formData.startTime} - {formData.endTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Teilnehmer</p>
              <p className="font-medium text-gray-900">{formData.participantCount} Personen</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-medium text-gray-900">CHF {formData.totalBudget.toLocaleString()}</p>
            </div>
          </div>
          {formData.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Beschreibung</p>
              <p className="text-gray-900 mt-1">{formData.description}</p>
            </div>
          )}
        </div>

        {/* Selected Locations */}
        {formData.selectedLocations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ausgewählte Locations ({formData.selectedLocations.length})
            </h3>
            <div className="space-y-3">
              {formData.selectedLocations.map((location, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{location.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        CHF {location.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        CHF {location.pricePerPerson} / Person
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
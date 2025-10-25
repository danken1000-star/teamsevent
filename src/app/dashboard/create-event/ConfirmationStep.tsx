'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'

type Location = {
  id: string
  name: string
  city: string
  category: string
  price_per_person: number
  capacity_min: number
  capacity_max: number
  description?: string
  address?: string
  phone?: string
  website?: string
  startTime?: string
}

interface ConfirmationStepProps {
  eventData: {
    title: string
    budget: number
    participant_count: number
    event_date: string
    event_type: string
    preferences: string[]
  }
  selectedLocations: Location[]
  onBack: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍔 Essen',
  sport: '⚽ Sport',
  games: '🎮 Games',
  culture: '🎨 Kultur',
  wellness: '💆 Wellness',
  outdoor: '🏔️ Outdoor',
  creative: '✨ Kreativ'
}

export default function ConfirmationStep({ 
  eventData, 
  selectedLocations,
  onBack 
}: ConfirmationStepProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate totals
  const totalCost = selectedLocations.reduce(
    (sum, location) => sum + (location.price_per_person * eventData.participant_count),
    0
  )
  const costPerPerson = totalCost / eventData.participant_count

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

      // 1. Event erstellen
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          budget: eventData.budget,
          participant_count: eventData.participant_count,
          person_count: eventData.participant_count, // Alias für neue Activities Logic
          event_date: eventData.event_date || null,
          event_type: eventData.event_type || null,
          preferences: eventData.preferences || [],
          user_id: user.id,
          status: 'planning'
        })
        .select()
        .single()

      if (eventError) throw eventError

      // 2. Event-Locations verknüpfen (Junction Table)
      const eventLocations = selectedLocations.map((location, index) => ({
        event_id: event.id,
        location_id: location.id,
        order_index: index,
        start_time: location.startTime || null
      }))

      const { error: junctionError } = await supabase
        .from('event_locations')
        .insert(eventLocations)

      if (junctionError) {
        console.error('Junction insert error:', junctionError)
        throw new Error(`Fehler beim Speichern der Locations: ${junctionError.message}`)
      }

      // 3. Aktivierten Key laden und Counter erhöhen
      const { data: userRow } = await supabase
        .from('users')
        .select('active_key_id')
        .eq('id', user.id)
        .single()

      if (userRow?.active_key_id) {
        await supabase.rpc('increment_key_events', {
          key_id: userRow.active_key_id
        })
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
              <p className="font-medium text-gray-900">CHF {eventData.budget.toLocaleString('de-CH')}</p>
            </div>
          </div>
        </div>

        {/* Selected Locations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ausgewählte Locations ({selectedLocations.length})
          </h3>
          <div className="space-y-3">
            {selectedLocations.map((location, index) => (
              <div key={location.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-gray-900">
                        {index + 1}. {location.name}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">
                        {location.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {location.city}
                      {location.address && ` - ${location.address}`}
                    </p>
                    {location.description && (
                      <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>👥 {location.capacity_min}-{location.capacity_max} Personen</span>
                      {location.startTime && (
                        <span>🕐 Startzeit: {location.startTime} Uhr</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-gray-900">
                      CHF {(location.price_per_person * eventData.participant_count).toLocaleString('de-CH')}
                    </p>
                    <p className="text-sm text-gray-600">
                      CHF {location.price_per_person} / Person
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="border-t pt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-600">Gesamtkosten</p>
                <p className="text-lg font-bold text-gray-900">
                  CHF {totalCost.toLocaleString('de-CH')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Pro Person</p>
                <p className="text-lg font-bold text-gray-900">
                  CHF {Math.round(costPerPerson)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Budget-Status</p>
                {totalCost <= eventData.budget ? (
                  <p className="text-lg font-bold text-green-600">
                    ✓ Im Budget
                  </p>
                ) : (
                  <p className="text-lg font-bold text-red-600">
                    ⚠️ Über Budget
                  </p>
                )}
              </div>
            </div>
            {totalCost <= eventData.budget && eventData.budget > 0 && (
              <p className="text-xs text-gray-600">
                💰 Verfügbares Budget: CHF {(eventData.budget - totalCost).toLocaleString('de-CH')}
              </p>
            )}
          </div>
        </div>
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
          ← Zurück
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium 
                     hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
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
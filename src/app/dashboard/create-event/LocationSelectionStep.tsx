'use client'

import { useState, useEffect } from 'react'

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

type LocationSelectionStepProps = {
  budget: number
  participantCount: number
  onSelect: (location: Location) => void
  onBack: () => void
}

export default function LocationSelectionStep({
  budget,
  participantCount,
  onSelect,
  onBack
}: LocationSelectionStepProps) {
  const [matches, setMatches] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch('/api/locations/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ budget, participantCount }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Fehler beim Laden der Locations')
          return
        }

        setMatches(data.matches || [])
      } catch (err) {
        console.error('Matching error:', err)
        setError('Ein unerwarteter Fehler ist aufgetreten')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [budget, participantCount])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Suche passende Locations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">❌ {error}</div>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          ← Zurück
        </button>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          Keine passenden Locations gefunden für Budget CHF {budget.toLocaleString('de-CH')} und {participantCount} Teilnehmer.
        </div>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          ← Budget anpassen
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {matches.length} passende Location{matches.length > 1 ? 's' : ''} gefunden
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Budget: CHF {budget.toLocaleString('de-CH')} | Teilnehmer: {participantCount}
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Zurück
        </button>
      </div>

      <div className="space-y-4">
        {matches.slice(0, 5).map((location) => (
          <div
            key={location.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {location.name}
                  </h3>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {location.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500">📍 {location.city}</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {location.match_score}%
                </div>
                <div className="text-xs text-gray-500">Match</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-600">Gesamtkosten</p>
                <p className="text-sm font-semibold text-gray-900">
                  CHF {location.total_cost.toLocaleString('de-CH')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Pro Person</p>
                <p className="text-sm font-semibold text-gray-900">
                  CHF {location.price_per_person}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Kapazität</p>
                <p className="text-sm font-semibold text-gray-900">
                  {location.capacity_min}-{location.capacity_max}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Budget</p>
                {location.fits_budget ? (
                  <span className="inline-flex items-center text-xs font-medium text-green-700">
                    ✅ Im Budget
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium text-yellow-700">
                    ⚠️ Über Budget
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onSelect(location)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Diese Location wählen →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
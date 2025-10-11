'use client'

import { useState } from 'react'
import Link from 'next/link'

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

export default function MatchLocationsPage() {
  const [budget, setBudget] = useState('')
  const [participants, setParticipants] = useState('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<Location[]>([])
  const [error, setError] = useState('')

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/locations/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: parseFloat(budget),
          participantCount: parseInt(participants)
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Matching fehlgeschlagen')
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard" className="text-red-600 hover:text-red-700 text-sm">
          ← Zurück zum Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Location Matching
        </h1>
        <p className="mt-2 text-gray-600">
          Finden Sie die perfekte Location für Ihr Team-Event
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleMatch} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Budget (CHF)
              </label>
              <input
                id="budget"
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700">
                Anzahl Teilnehmer
              </label>
              <input
                id="participants"
                type="number"
                required
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Suche passende Locations...' : '🎯 Locations finden'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎉 {matches.length} passende Locations gefunden
          </h2>
          <div className="space-y-4">
            {matches.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-500">📍 {location.city}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {location.match_score}%
                    </div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Gesamtkosten</p>
                    <p className="text-lg font-semibold text-gray-900">
                      CHF {location.total_cost.toLocaleString('de-CH')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pro Person</p>
                    <p className="text-lg font-semibold text-gray-900">
                      CHF {location.price_per_person}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kapazität</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {location.capacity_min} - {location.capacity_max}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {location.fits_budget ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Im Budget
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠️ Über Budget
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {location.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && !loading && !error && budget && participants && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Keine passenden Locations gefunden. Versuchen Sie ein höheres Budget oder weniger Teilnehmer.
          </p>
        </div>
      )}
    </div>
  )
}
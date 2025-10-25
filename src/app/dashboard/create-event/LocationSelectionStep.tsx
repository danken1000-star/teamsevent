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
  description?: string
  address?: string
  phone?: string
  website?: string
}

type LocationSelectionStepProps = {
  budget?: number
  participantCount: number
  preferences: string[]
  onSelect: (locations: (Location & { startTime: string })[]) => void
  onBack: () => void
}

// Map user preferences to location categories
const PREFERENCE_TO_CATEGORY: Record<string, string[]> = {
  food: ['restaurant', 'cafe'],
  active: ['activity', 'sport'],
  sport: ['activity', 'sport'],
  indoor: ['indoor', 'activity'],
  outdoor: ['outdoor', 'activity'],
  relaxed: ['wellness', 'cafe'],
  team: ['activity', 'team_building'],
  culture: ['culture', 'museum'],
  games: ['activity', 'entertainment']
}

type SelectedLocationWithTime = Location & {
  startTime: string
}

export default function LocationSelectionStep({
  budget,
  participantCount,
  preferences,
  onSelect,
  onBack
}: LocationSelectionStepProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocationWithTime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null)

  // Load all locations
  useEffect(() => {
    async function fetchLocations() {
      try {
        // Use direct Supabase client import for browser
        const { createClient } = await import('@supabase/supabase-js')
        
        const supabaseClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error: fetchError } = await supabaseClient
          .from('locations')
          .select('*')

        if (fetchError) throw fetchError
        
        setLocations(data || [])
      } catch (err) {
        console.error('Locations fetch error:', err)
        setError('Fehler beim Laden der Locations')
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // Filter locations based on preferences and budget
  const getFilteredLocations = () => {
    let filtered = [...locations]

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(loc => loc.category === filterCategory)
    }

    // Apply preference filter if preferences exist
    if (preferences.length > 0) {
      const validCategories = new Set<string>()
      preferences.forEach(pref => {
        const categories = PREFERENCE_TO_CATEGORY[pref] || []
        categories.forEach(cat => validCategories.add(cat))
      })
      
      if (validCategories.size > 0) {
        filtered = filtered.filter(loc => validCategories.has(loc.category))
      }
    }

    // Apply budget filter if budget exists
    if (budget) {
      const budgetPerPerson = budget / participantCount
      filtered = filtered.filter(loc => loc.price_per_person <= budgetPerPerson)
    }

    // Apply capacity filter
    filtered = filtered.filter(
      loc => participantCount >= loc.capacity_min && participantCount <= loc.capacity_max
    )

    return filtered
  }

  const handleLocationToggle = (location: Location) => {
    const isSelected = selectedLocations.some(loc => loc.id === location.id)
    
    if (isSelected) {
      // Deselect
      setSelectedLocations(selectedLocations.filter(loc => loc.id !== location.id))
      setEditingTimeIndex(null)
    } else {
      // Select (max 3) - with default time 12:00
      if (selectedLocations.length < 3) {
        setSelectedLocations([...selectedLocations, { ...location, startTime: '12:00' }])
      } else {
        alert('Sie können maximal 3 Locations auswählen')
      }
    }
  }

  const handleTimeChange = (locationId: string, time: string) => {
    setSelectedLocations(prev => 
      prev.map(loc => 
        loc.id === locationId ? { ...loc, startTime: time } : loc
      )
    )
  }

  const handleContinue = () => {
    if (selectedLocations.length === 0) {
      alert('Bitte wählen Sie mindestens eine Location aus')
      return
    }
    onSelect(selectedLocations)
  }

  const filteredLocations = getFilteredLocations()

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Lädt Locations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  // Get unique categories for filter
  const categories = [...new Set(locations.map(loc => loc.category))]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Locations auswählen
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Wählen Sie bis zu 3 Locations aus, zwischen denen Ihr Team abstimmen kann
        </p>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategorie filtern
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="all">Alle Kategorien</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Selected Locations with Time */}
      {selectedLocations.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="font-semibold text-green-900 mb-3">
            ✓ {selectedLocations.length} Location(s) ausgewählt
          </p>
          <div className="space-y-3">
            {selectedLocations.map((loc, index) => (
              <div key={loc.id} className="bg-white rounded-lg p-3 border border-green-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {index + 1}. {loc.name} ({loc.city})
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <label className="text-xs text-gray-600 whitespace-nowrap">
                      Startzeit:
                    </label>
                    <input
                      type="time"
                      value={loc.startTime}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleTimeChange(loc.id, e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locations List */}
      {filteredLocations.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            Keine passenden Locations gefunden.
          </p>
          <p className="text-sm text-gray-500">
            Versuchen Sie andere Filter oder passen Sie das Budget an.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLocations.map(location => {
            const isSelected = selectedLocations.some(loc => loc.id === location.id)
            const totalCost = location.price_per_person * participantCount
            
            return (
              <div
                key={location.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleLocationToggle(location)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{location.name}</h3>
                      {isSelected && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Ausgewählt
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {location.city}
                      {location.address && `, ${location.address}`}
                    </p>
                    {location.description && (
                      <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                      <div>
                        <span className="text-gray-600">Preis/Person:</span>
                        <span className="font-semibold ml-1">
                          CHF {location.price_per_person}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Gesamt:</span>
                        <span className="font-semibold ml-1">
                          CHF {totalCost}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Kapazität:</span>
                        <span className="font-semibold ml-1">
                          {location.capacity_min}-{location.capacity_max}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Kategorie:</span>
                        <span className="font-semibold ml-1 capitalize">
                          {location.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
        >
          ← Zurück
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedLocations.length === 0}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Weiter ({selectedLocations.length}/3)
        </button>
      </div>
    </div>
  )
}
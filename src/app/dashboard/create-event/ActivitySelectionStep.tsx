'use client'

import { useState, useEffect } from 'react'

type Activity = {
  id: string
  name: string
  description: string
  category: string
  price_per_person: number
  min_persons: number
  max_persons: number
  duration_hours: number
  tags: string[]
  popular: boolean
}

type ActivitySelectionStepProps = {
  budget: number
  participantCount: number
  preferences: string[]
  onSelect: (activities: Activity[]) => void
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

export default function ActivitySelectionStep({
  budget,
  participantCount,
  preferences,
  onSelect,
  onBack
}: ActivitySelectionStepProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch('/api/activities')
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Fehler beim Laden der Activities')
          return
        }

        setActivities(data.activities || [])
      } catch (err) {
        console.error('Activities fetch error:', err)
        setError('Ein unerwarteter Fehler ist aufgetreten')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // Calculate total cost
  const totalCost = selectedActivities.reduce(
    (sum, activity) => sum + (activity.price_per_person * participantCount),
    0
  )
  const budgetPerPerson = budget / participantCount
  const costPerPerson = totalCost / participantCount
  const budgetRemaining = budget - totalCost
  const isOverBudget = totalCost > budget

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    // Category filter
    if (filterCategory !== 'all' && activity.category !== filterCategory) {
      return false
    }

    // Budget filter - only show activities within budget per person
    if (activity.price_per_person > budgetPerPerson) {
      return false
    }

    // Capacity filter
    if (participantCount < activity.min_persons || participantCount > activity.max_persons) {
      return false
    }

    return true
  })

  // Sort: popular first, then by preference match, then by price
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    // Popular first
    if (a.popular && !b.popular) return -1
    if (!a.popular && b.popular) return 1

    // Then by preference match
    const aMatch = preferences.some(pref => a.tags.includes(pref))
    const bMatch = preferences.some(pref => b.tags.includes(pref))
    if (aMatch && !bMatch) return -1
    if (!aMatch && bMatch) return 1

    // Then by price (cheaper first)
    return a.price_per_person - b.price_per_person
  })

  const toggleActivity = (activity: Activity) => {
    const isSelected = selectedActivities.some(a => a.id === activity.id)
    
    if (isSelected) {
      setSelectedActivities(selectedActivities.filter(a => a.id !== activity.id))
    } else {
      // Max 3 activities
      if (selectedActivities.length >= 3) {
        alert('Du kannst maximal 3 Activities auswählen')
        return
      }
      setSelectedActivities([...selectedActivities, activity])
    }
  }

  const handleContinue = () => {
    if (selectedActivities.length === 0) {
      alert('Bitte wähle mindestens 1 Activity aus')
      return
    }
    onSelect(selectedActivities)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Lade Activities...</p>
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

  const categories = ['all', ...Array.from(new Set(activities.map(a => a.category)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Wähle 1-3 Activities
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Budget: CHF {budget.toLocaleString('de-CH')} | {participantCount} Personen
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Zurück
        </button>
      </div>

      {/* Budget Overview - Fixed at Top */}
      <div className={`p-4 rounded-lg border-2 ${
        isOverBudget ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Ausgewählte Activities: {selectedActivities.length}/3
            </p>
            <p className="text-xs text-gray-600 mt-1">
              CHF {costPerPerson.toFixed(0)}/Person von CHF {budgetPerPerson.toFixed(0)}/Person
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              CHF {totalCost.toLocaleString('de-CH')}
            </p>
            <p className={`text-xs font-semibold ${
              isOverBudget ? 'text-red-600' : 'text-green-600'
            }`}>
              {isOverBudget ? `CHF ${Math.abs(budgetRemaining)} über Budget` : `CHF ${budgetRemaining} verfügbar`}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? '🎯 Alle' : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      {sortedActivities.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Keine passenden Activities gefunden. Versuche andere Filter oder erhöhe das Budget.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedActivities.map((activity) => {
            const isSelected = selectedActivities.some(a => a.id === activity.id)
            const activityCost = activity.price_per_person * participantCount
            const matchesPreference = preferences.some(pref => activity.tags.includes(pref))

            return (
              <div
                key={activity.id}
                onClick={() => toggleActivity(activity)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{activity.name}</h3>
                      {activity.popular && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                          ⭐ Beliebt
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-2">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      CHF {activityCost}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pro Person:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      CHF {activity.price_per_person}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dauer:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      {activity.duration_hours}h
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Kategorie:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      {CATEGORY_LABELS[activity.category] || activity.category}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {matchesPreference && (
                  <div className="mb-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      ✓ Passt zu deinen Präferenzen
                    </span>
                  </div>
                )}

                {/* Select Button */}
                <button
                  type="button"
                  className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? '✓ Ausgewählt' : 'Auswählen'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Continue Button - Fixed at Bottom */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t">
        <button
          onClick={handleContinue}
          disabled={selectedActivities.length === 0}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            selectedActivities.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 shadow-md'
          }`}
        >
          {selectedActivities.length === 0
            ? 'Wähle mindestens 1 Activity'
            : `Weiter mit ${selectedActivities.length} ${selectedActivities.length === 1 ? 'Activity' : 'Activities'} →`
          }
        </button>
      </div>
    </div>
  )
}
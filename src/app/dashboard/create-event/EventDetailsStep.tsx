import { useState } from 'react'

interface EventDetailsStepProps {
  eventData: {
    title: string
    budget: number
    participant_count: number
    event_date: string
    event_type: string
    preferences: string[]
  }
  setEventData: (data: any) => void
  onNext: () => void
}

const PREFERENCE_OPTIONS = [
  { id: 'active', label: '⚡ Aktiv', description: 'Sport & Bewegung' },
  { id: 'food', label: '🍔 Essen', description: 'Kulinarik & Genuss' },
  { id: 'indoor', label: '🏢 Indoor', description: 'Drinnen stattfindend' },
  { id: 'outdoor', label: '🏔️ Outdoor', description: 'Draussen in der Natur' },
  { id: 'relaxed', label: '😌 Entspannt', description: 'Gemütlich & locker' },
  { id: 'team', label: '👥 Team', description: 'Team-Building Fokus' },
  { id: 'culture', label: '🎨 Kultur', description: 'Kulturell & Bildung' },
  { id: 'games', label: '🎮 Games', description: 'Spiele & Unterhaltung' },
]

export default function EventDetailsStep({ 
  eventData, 
  setEventData, 
  onNext 
}: EventDetailsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (eventData.title && eventData.participant_count) {
      onNext()
    }
  }

  const togglePreference = (prefId: string) => {
    const currentPrefs = eventData.preferences || []
    if (currentPrefs.includes(prefId)) {
      setEventData({
        ...eventData,
        preferences: currentPrefs.filter(p => p !== prefId)
      })
    } else {
      setEventData({
        ...eventData,
        preferences: [...currentPrefs, prefId]
      })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Event-Details
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Erzähl uns mehr über dein geplantes Event
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Event Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            required
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            placeholder="z.B. Team-Ausflug Sommer 2025"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
          />
        </div>

        {/* Budget Toggle */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={eventData.budget > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setEventData({ ...eventData, budget: 1000 })
                } else {
                  setEventData({ ...eventData, budget: 0 })
                }
              }}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Budget festlegen</span>
          </label>
        </div>

        {/* Budget */}
        {eventData.budget > 0 && (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Gesamtbudget (CHF)
          </label>
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={eventData.budget}
            onChange={(e) => setEventData({ ...eventData, budget: parseInt(e.target.value) })}
            className="w-full accent-red-600"
          />
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
            <span>CHF 500</span>
            <span className="font-bold text-lg text-red-600">
              CHF {eventData.budget.toLocaleString('de-CH')}
            </span>
            <span>CHF 10'000</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            💡 Pro Person: CHF {Math.round(eventData.budget / eventData.participant_count)}
          </p>
        </div>
        )}

        {/* Teilnehmer */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Anzahl Teilnehmer *
          </label>
          <input
            type="number"
            required
            min="3"
            max="100"
            value={eventData.participant_count}
            onChange={(e) => setEventData({ ...eventData, participant_count: parseInt(e.target.value) })}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
          />
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Minimum 3 Personen
          </p>
        </div>

        {/* Präferenzen - NEU! */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
            Was wünscht sich das Team? (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {PREFERENCE_OPTIONS.map((pref) => {
              const isSelected = (eventData.preferences || []).includes(pref.id)
              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => togglePreference(pref.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-red-500 bg-red-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg sm:text-xl mb-1">{pref.label}</div>
                  <div className="text-xs text-gray-600">{pref.description}</div>
                  {isSelected && (
                    <div className="mt-2 text-xs font-semibold text-red-600">
                      ✓ Ausgewählt
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            💡 Wir zeigen dir passende Locations basierend auf deinen Präferenzen
          </p>
        </div>

        {/* Event Datum */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Gewünschtes Datum (Optional)
          </label>
          <input
            type="date"
            value={eventData.event_date}
            onChange={(e) => setEventData({ ...eventData, event_date: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
          />
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Du kannst das Datum auch später mit deinem Team abstimmen
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors shadow-md"
        >
          Weiter zu Locations auswählen →
        </button>
      </form>
    </div>
  )
}
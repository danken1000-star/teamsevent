import { useState } from 'react'

interface EventDetailsStepProps {
  eventData: {
    title: string
    budget: number
    participant_count: number
    event_date: string
    event_type: string
  }
  setEventData: (data: any) => void
  onNext: () => void
}

export default function EventDetailsStep({ 
  eventData, 
  setEventData, 
  onNext 
}: EventDetailsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (eventData.title && eventData.budget && eventData.participant_count) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Event-Details
        </h2>
        <p className="text-gray-600">
          Erzähl uns mehr über dein geplantes Event
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            required
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            placeholder="z.B. Team-Ausflug Sommer 2025"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Event Type - NEU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Was für ein Event? (Optional)
          </label>
          <input
            type="text"
            value={eventData.event_type || ''}
            onChange={(e) => setEventData({ ...eventData, event_type: e.target.value })}
            placeholder="z.B. Essen mit Bowlen, Team-Workshop, Sommerfest, Weihnachtsfeier..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            💡 Hilft uns die perfekte Location zu finden
          </p>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget (CHF) *
          </label>
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={eventData.budget}
            onChange={(e) => setEventData({ ...eventData, budget: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>CHF 500</span>
            <span className="font-semibold text-blue-600">
              CHF {eventData.budget.toLocaleString()}
            </span>
            <span>CHF 10'000</span>
          </div>
        </div>

        {/* Teilnehmer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anzahl Teilnehmer *
          </label>
          <input
            type="number"
            required
            min="3"
            max="100"
            value={eventData.participant_count}
            onChange={(e) => setEventData({ ...eventData, participant_count: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Minimum 3 Personen
          </p>
        </div>

        {/* Event Datum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gewünschtes Datum (Optional)
          </label>
          <input
            type="date"
            value={eventData.event_date}
            onChange={(e) => setEventData({ ...eventData, event_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Du kannst das Datum auch später mit deinem Team abstimmen
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Weiter zur Location-Auswahl →
        </button>
      </form>
    </div>
  )
}
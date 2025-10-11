'use client'

import { useState } from 'react'

type EventDetailsStepProps = {
  initialData: {
    title: string
    budget: number
    participant_count: number
    event_date: string
  }
  onNext: (data: {
    title: string
    budget: number
    participant_count: number
    event_date: string
  }) => void
}

export default function EventDetailsStep({ initialData, onNext }: EventDetailsStepProps) {
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Event-Details eingeben
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Geben Sie die grundlegenden Informationen für Ihr Event ein
        </p>
      </div>

      {/* Event Name */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Event Name *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="z.B. Team-Building Herbst 2025"
        />
      </div>

      {/* Budget Slider */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
          Budget: CHF {formData.budget.toLocaleString('de-CH')}
        </label>
        <input
          type="range"
          id="budget"
          min="500"
          max="10000"
          step="100"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>CHF 500</span>
          <span>CHF 10&apos;000</span>
        </div>
      </div>

      {/* Teilnehmer */}
      <div>
        <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
          Anzahl Teilnehmer *
        </label>
        <input
          type="number"
          id="participants"
          min="3"
          max="100"
          required
          value={formData.participant_count}
          onChange={(e) => setFormData({ ...formData, participant_count: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">Minimum: 3 Teilnehmer</p>
      </div>

      {/* Event Datum */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Event Datum (optional)
        </label>
        <input
          type="date"
          id="date"
          value={formData.event_date}
          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-8 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
        >
          Weiter zur Location-Auswahl →
        </button>
      </div>
    </form>
  )
}
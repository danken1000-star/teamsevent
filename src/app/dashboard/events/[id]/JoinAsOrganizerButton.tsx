'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface JoinAsOrganizerButtonProps {
  eventId: string
  userEmail: string
  userName?: string
}

export default function JoinAsOrganizerButton({ 
  eventId, 
  userEmail, 
  userName 
}: JoinAsOrganizerButtonProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: userName || '',
    email: userEmail,
    dietaryPreference: '',
    dietaryNotes: ''
  })
  const router = useRouter()

  const handleJoinAsOrganizer = async () => {
    if (isJoined) return

    if (!formData.name || !formData.email) {
      alert('Bitte Name und Email eingeben')
      return
    }

    setIsJoining(true)

    try {
      const response = await fetch('/api/participate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          name: formData.name,
          email: formData.email,
          dietary_preference: formData.dietaryPreference,
          dietary_notes: formData.dietaryNotes,
          participation_type: 'confirmed'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join as organizer')
      }

      setIsJoined(true)
      setShowForm(false)
      router.refresh() // Refresh the page to show updated participation
    } catch (error: any) {
      console.error('Error joining as organizer:', error)
      alert(`Fehler beim Beitreten: ${error.message}`)
    } finally {
      setIsJoining(false)
    }
  }

  if (isJoined) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="text-sm text-green-800 font-medium">
            Du nimmst am Event teil
          </span>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3">
          Auch am Event teilnehmen
        </h3>
        <p className="text-xs text-blue-700 mb-4">
          Bitte vervollständige deine Teilnehmerdaten für die Weiterleitung an die Locations.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dein Name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="deine.email@beispiel.ch"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ernährungspräferenz</label>
            <select
              value={formData.dietaryPreference}
              onChange={(e) => setFormData({...formData, dietaryPreference: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Bitte wählen...</option>
              <option value="omnivor">🍖 Omnivor (Alles)</option>
              <option value="vegetarisch">🥗 Vegetarisch</option>
              <option value="vegan">🌱 Vegan</option>
              <option value="kein_schweinefleisch">🐷 Kein Schweinefleisch</option>
              <option value="sonstiges">⚠️ Sonstiges</option>
            </select>
          </div>

          {formData.dietaryPreference === 'sonstiges' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bitte beschreiben Sie Ihre Ernährungspräferenz</label>
              <textarea
                value={formData.dietaryNotes}
                onChange={(e) => setFormData({...formData, dietaryNotes: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Nussallergie, Glutenunverträglichkeit, etc."
                rows={2}
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleJoinAsOrganizer}
              disabled={isJoining || !formData.name || !formData.email}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isJoining ? 'Wird hinzugefügt...' : 'Teilnahme bestätigen'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-900 mb-1">
            Auch am Event teilnehmen
          </h3>
          <p className="text-xs text-blue-700">
            Teilnahme als Eventplaner bestätigen.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Teilnehmen
        </button>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { toast } from 'sonner'

interface OrganizerJoinModalProps {
  eventId: string
  userEmail: string
  onClose: () => void
}

export default function OrganizerJoinModal({ 
  eventId, 
  userEmail,
  onClose 
}: OrganizerJoinModalProps) {
  const [name, setName] = useState('')
  const [dietaryPreference, setDietaryPreference] = useState('omnivor')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Bitte Namen eingeben')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // Add organizer to team_members
      const { data: newMember, error: memberError } = await supabase
        .from('team_members')
        .insert({
          event_id: eventId,
          name: name.trim(),
          email: userEmail,
          dietary_preference: dietaryPreference || null,
          dietary_notes: dietaryNotes.trim() || null
        })
        .select()
        .single()

      if (memberError) { console.error("Member insert error:", memberError); throw memberError; }

      // Create confirmed vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          event_id: eventId,
          team_member_id: newMember.id,
          vote_type: 'attendance',
          vote_value: 'confirmed'
        })

      if (voteError) throw voteError

      toast.success('Teilnahme bestätigt!')
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error joining event:', error)
      toast.error('Fehler beim Bestätigen der Teilnahme')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Am Event teilnehmen</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bestätige deine Teilnahme als Eventplaner
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Ernährungspräferenz */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ernährungspräferenz
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="omnivor">🍖 Ich esse alles</option>
              <option value="vegetarisch">🥗 Vegetarisch</option>
              <option value="vegan">🌱 Vegan</option>
              <option value="kein_schweinefleisch">🐷 Kein Schweinefleisch</option>
              <option value="sonstiges">Sonstiges</option>

            </select>
          </div>
          {/* Zusätzliche Notizen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zusätzliche Notizen
            </label>
            <textarea
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              placeholder="z.B. Allergien, weitere Einschränkungen..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Lädt...' : 'Teilnahme bestätigen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

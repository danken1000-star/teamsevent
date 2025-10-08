'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    title: '',
    budget: 2500,
    participant_count: 20,
    event_date: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // User ID holen
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  setError('Sie müssen eingeloggt sein')
  return
}

const { error: insertError } = await supabase
  .from('events')
  .insert([
    {
      title: formData.title,
      budget: formData.budget,
      participant_count: formData.participant_count,
      event_date: formData.event_date || null,
      status: 'planning',
      user_id: user.id  // <-- NEU!
    }
  ])
  .select()

      if (insertError) throw insertError

      setSuccess(true)
      
      // Nach 2 Sekunden zum Dashboard weiterleiten
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Fehler beim Erstellen des Events')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Neues Event erstellen</h1>
        <p className="mt-2 text-gray-600">
          Erstellen Sie ein neues Mitarbeiter-Event in wenigen Schritten
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {success ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Event erfolgreich erstellt!
            </h2>
            <p className="text-gray-600">
              Sie werden zum Dashboard weitergeleitet...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                Anzahl Teilnehmer
              </label>
              <input
                type="number"
                id="participants"
                min="5"
                max="100"
                value={formData.participant_count}
                onChange={(e) => setFormData({ ...formData, participant_count: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Wird erstellt...' : 'Event erstellen'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
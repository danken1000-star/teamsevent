'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type VotingFormProps = {
  eventId: string
  memberId: string
  currentDate: string | null
}

export default function VotingForm({ eventId, memberId, currentDate }: VotingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(currentDate || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Generate date options (next 30 days, only weekdays)
  const getDateOptions = () => {
    const options = []
    const today = new Date()
    
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue
      
      options.push(date)
      
      if (options.length >= 20) break // Limit to 20 options
    }
    
    return options
  }

  const dateOptions = getDateOptions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate) {
      setError('Bitte wählen Sie ein Datum')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/events/${eventId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_member_id: memberId,
          vote_type: 'date',
          vote_value: selectedDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Fehler beim Abstimmen')
        return
      }

      // Refresh to show success message
      router.refresh()
    } catch (err) {
      console.error('Vote error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Wählen Sie Ihr bevorzugtes Datum
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Bitte wählen Sie aus den verfügbaren Terminen. Es werden nur Werktage angezeigt.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dateOptions.map((date) => {
              const dateStr = date.toISOString().split('T')[0]
              const isSelected = selectedDate === dateStr
              
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-gray-900">
                    {date.toLocaleDateString('de-CH', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {date.toLocaleDateString('de-CH', { year: 'numeric' })}
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-red-600 text-sm font-medium">
                      ✓ Ausgewählt
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedDate}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '⏳ Wird abgestimmt...' : '✓ Jetzt abstimmen'}
        </button>
      </form>
    </div>
  )
}
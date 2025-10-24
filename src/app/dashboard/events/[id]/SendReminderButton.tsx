'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SendReminderButtonProps {
  eventId: string
  pendingMembers: any[]
}

export default function SendReminderButton({ eventId, pendingMembers }: SendReminderButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSendReminder = async () => {
    if (pendingMembers.length === 0) {
      setError('Keine ausstehenden Teilnehmer gefunden')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch(`/api/events/${eventId}/reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pendingMemberIds: pendingMembers.map(m => m.id)
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Fehler beim Senden der Erinnerung')
        return
      }

      setSuccess(true)
      router.refresh()
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Reminder error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  if (pendingMembers.length === 0) {
    return null
  }

  return (
    <div>
      <button
        onClick={handleSendReminder}
        disabled={loading}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 disabled:opacity-50 text-sm transition-colors"
      >
        {loading ? 'Erinnerung wird gesendet...' : `📧 Erinnerung an ${pendingMembers.length} ausstehende Teilnehmer senden`}
      </button>
      
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2 mt-2">
          ✓ Erinnerung an {pendingMembers.length} Teilnehmer gesendet!
        </div>
      )}
    </div>
  )
}

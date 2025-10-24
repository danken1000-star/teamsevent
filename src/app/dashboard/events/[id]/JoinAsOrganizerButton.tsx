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
  const router = useRouter()

  const handleJoinAsOrganizer = async () => {
    if (isJoined) return

    setIsJoining(true)

    try {
      const response = await fetch('/api/participate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          name: userName || 'Organisator',
          email: userEmail,
          dietary_preference: '',
          dietary_notes: '',
          participation_type: 'confirmed'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join as organizer')
      }

      setIsJoined(true)
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
            Du nimmst als Organisator teil
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-900 mb-1">
            Als Organisator teilnehmen
          </h3>
          <p className="text-xs text-blue-700">
            Du kannst dich direkt als Teilnehmer hinzufügen, ohne dich selbst einzuladen.
          </p>
        </div>
        <button
          onClick={handleJoinAsOrganizer}
          disabled={isJoining}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isJoining ? 'Wird hinzugefügt...' : 'Teilnehmen'}
        </button>
      </div>
    </div>
  )
}

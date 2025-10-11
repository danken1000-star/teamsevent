'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type DeleteEventButtonProps = {
  eventId: string
  eventTitle: string
}

export default function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    // Bestätigung
    const confirmed = confirm(
      `Möchten Sie das Event "${eventTitle}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
    )
    
    if (!confirmed) return

    setLoading(true)

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Fehler beim Löschen')
        return
      }

      // Refresh page to update event list
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50 transition-colors"
    >
      {loading ? '⏳ Wird gelöscht...' : '🗑️ Löschen'}
    </button>
  )
}
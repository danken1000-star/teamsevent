'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditableEventTitleProps {
  eventId: string
  title: string
  isFinalized: boolean
}

export default function EditableEventTitle({ eventId, title, isFinalized }: EditableEventTitleProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (editTitle.trim() === title) {
      setIsEditing(false)
      return
    }

    if (!editTitle.trim()) {
      setError('Event-Name darf nicht leer sein')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Fehler beim Speichern')
        return
      }

      setIsEditing(false)
      router.refresh()
    } catch (err) {
      console.error('Update error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(title)
    setIsEditing(false)
    setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isFinalized) {
    return (
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
        {title}
      </h1>
    )
  }

  if (isEditing) {
    return (
      <div className="mb-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-xl sm:text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-red-500 focus:outline-none focus:border-red-600 break-words"
          autoFocus
          disabled={loading}
        />
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Speichert...' : 'Speichern'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Abbrechen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 break-words flex-1">
        {title}
      </h1>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Event-Name bearbeiten"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>
  )
}

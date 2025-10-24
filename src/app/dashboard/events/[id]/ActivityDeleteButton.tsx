'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ActivityDeleteButtonProps {
  eventId: string
  eventActivityId: string
  activityName: string
  isVisible: boolean
}

export default function ActivityDeleteButton({ 
  eventId, 
  eventActivityId, 
  activityName,
  isVisible 
}: ActivityDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Activity "${activityName}" wirklich entfernen?`)) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${eventId}/activities/${eventActivityId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Activity entfernt!')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Fehler beim Entfernen')
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast.error('Fehler beim Entfernen der Activity')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isVisible) return null

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm font-bold disabled:bg-gray-400"
      title="Activity entfernen"
    >
      {isDeleting ? '...' : '×'}
    </button>
  )
}

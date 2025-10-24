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
      console.log('ActivityDeleteButton: Deleting activity', { eventId, eventActivityId, activityName })
      
      const response = await fetch(`/api/events/${eventId}/activities/${eventActivityId}`, {
        method: 'DELETE'
      })

      console.log('ActivityDeleteButton: Response status:', response.status)

      // Check if response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('ActivityDeleteButton: API error:', errorData)
        throw new Error(errorData.error || 'Failed to delete activity')
      }

      // Parse JSON response
      const data = await response.json()
      console.log('ActivityDeleteButton: API response:', data)
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete activity')
      }

      console.log('ActivityDeleteButton: Success, refreshing page...')
      toast.success('Activity entfernt!')
      
      // Force page refresh
      router.refresh()
      
      // Additional fallback: reload after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      console.error('ActivityDeleteButton: Error deleting activity:', error)
      toast.error(error instanceof Error ? error.message : 'Fehler beim Entfernen der Activity')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isVisible) return null

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 disabled:opacity-50"
      title="Activity entfernen"
      aria-label="Activity entfernen"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
        />
      </svg>
    </button>
  )
}

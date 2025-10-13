'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'
import { toast } from 'sonner'

interface DeleteEventButtonProps {
  eventId: string
  eventTitle: string
}

export default function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createBrowserClient()

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      toast.error('Fehler beim Löschen')
      setIsDeleting(false)
      return
    }

    toast.success('Event gelöscht!')
    setShowModal(false)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 border-2 border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors"
      >
        🗑️ Löschen
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-black mb-4">
              Event löschen?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Möchten Sie "<strong className="text-black">{eventTitle}</strong>" wirklich löschen? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 text-sm font-bold text-black bg-white border-2 border-gray-200 rounded-xl hover:border-black transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Lösche...' : 'Ja, löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type FinalizeEventButtonProps = {
  eventId: string
  currentStatus: string
}

export default function FinalizeEventButton({ 
  eventId, 
  currentStatus 
}: FinalizeEventButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Don't show button if already finalized
  if (currentStatus === 'finalized') {
    return null
  }

  const handleFinalize = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/events/${eventId}/finalize`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Fehler beim Finalisieren')
        return
      }

      toast.success('✅ Event erfolgreich finalisiert!')
      setShowModal(false)
      router.refresh()
    } catch (error) {
      console.error('Finalize error:', error)
      toast.error('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Finalize Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
      >
        ✓ Event finalisieren
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !loading && setShowModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Event finalisieren?
            </h3>
            
            <p className="text-gray-600 mb-6">
              Möchtest du dieses Event wirklich finalisieren? 
              Nach der Finalisierung kann das Voting nicht mehr geändert werden.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Hinweis:</strong> Das Event wird als abgeschlossen markiert und das Team wird benachrichtigt.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleFinalize}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Wird finalisiert...' : '✓ Jetzt finalisieren'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
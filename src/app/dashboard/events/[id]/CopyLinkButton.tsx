'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface CopyLinkButtonProps {
  eventId: string
}

export default function CopyLinkButton({ eventId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const voteLink = `${window.location.origin}/vote/${eventId}`
    
    try {
      await navigator.clipboard.writeText(voteLink)
      setCopied(true)
      toast.success('Link kopiert! ✓', {
        description: 'Teile den Link mit deinem Team zum Abstimmen.',
        duration: 3000,
      })
      
      // Reset nach 2 Sekunden
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Fehler beim Kopieren', {
        description: 'Bitte kopiere den Link manuell.',
      })
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
    >
      {copied ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Kopiert!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Vote-Link kopieren
        </>
      )}
    </button>
  )
}
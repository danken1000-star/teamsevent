'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InviteTeamMembersMultiProps = {
  eventId: string
}

interface EmailInvite {
  email: string
  name: string
}

export default function InviteTeamMembersMulti({ eventId }: InviteTeamMembersMultiProps) {
  const router = useRouter()
  const [emails, setEmails] = useState<EmailInvite[]>([{ email: '', name: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [successCount, setSuccessCount] = useState(0)

  const addEmailField = () => {
    setEmails([...emails, { email: '', name: '' }])
  }

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, field: 'email' | 'name', value: string) => {
    const updatedEmails = [...emails]
    updatedEmails[index][field] = value
    setEmails(updatedEmails)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setSuccessCount(0)

    // Filter out empty emails
    const validEmails = emails.filter(email => email.email.trim() !== '')
    
    if (validEmails.length === 0) {
      setError('Bitte mindestens eine E-Mail-Adresse eingeben')
      setLoading(false)
      return
    }

    try {
      let successCount = 0
      const errors: string[] = []

      // Send invitations one by one
      for (const emailData of validEmails) {
        try {
          const response = await fetch(`/api/events/${eventId}/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: emailData.email.trim(), 
              name: emailData.name.trim() || undefined 
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            errors.push(`${emailData.email}: ${data.error || 'Fehler beim Einladen'}`)
          } else {
            successCount++
          }
        } catch (err) {
          errors.push(`${emailData.email}: Ein unerwarteter Fehler`)
        }
      }

      if (errors.length > 0) {
        setError(`Fehler bei ${errors.length} E-Mail(s): ${errors.join(', ')}`)
      }

      if (successCount > 0) {
        setSuccess(true)
        setSuccessCount(successCount)
        setEmails([{ email: '', name: '' }]) // Reset to one empty field
        
        // Refresh page to show new members
        router.refresh()
        
        setTimeout(() => {
          setSuccess(false)
          setSuccessCount(0)
        }, 5000)
      }
    } catch (err) {
      console.error('Invite error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team-Mitglieder einladen
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Füge mehrere E-Mail-Adressen hinzu, um ein ganzes Team einzuladen
          </p>
        </div>

        {emails.map((email, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  E-Mail {index + 1} *
                </label>
                <input
                  type="email"
                  value={email.email}
                  onChange={(e) => updateEmail(index, 'email', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 font-medium"
                  placeholder="max@firma.ch"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={email.name}
                  onChange={(e) => updateEmail(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 font-medium"
                  placeholder="Max Muster"
                />
              </div>
            </div>
            {emails.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmailField(index)}
                className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                title="E-Mail entfernen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addEmailField}
          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-red-300 hover:text-red-600 transition-colors text-sm font-medium"
        >
          + Weitere E-Mail hinzufügen
        </button>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
            ✓ {successCount} Einladung{successCount !== 1 ? 'en' : ''} versendet!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 text-sm"
        >
          {loading ? 'Wird eingeladen...' : `✉️ ${emails.filter(e => e.email.trim()).length} Team-Mitglieder einladen`}
        </button>
      </form>
    </div>
  )
}

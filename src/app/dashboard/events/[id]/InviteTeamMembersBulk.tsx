'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InviteTeamMembersBulkProps = {
  eventId: string
}

interface EmailInvite {
  email: string
  name: string
}

export default function InviteTeamMembersBulk({ eventId }: InviteTeamMembersBulkProps) {
  const router = useRouter()
  const [emailText, setEmailText] = useState('')
  const [parsedEmails, setParsedEmails] = useState<EmailInvite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [successCount, setSuccessCount] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  // Parse emails from text input
  const parseEmails = (text: string): EmailInvite[] => {
    if (!text || text.trim().length === 0) return []
    
    // Split by common delimiters: newlines, commas, semicolons, spaces
    const lines = text
      .split(/[\n,;]/)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    const emails: EmailInvite[] = []
    
    for (const line of lines) {
      // Check if line contains email pattern - improved regex
      const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
      
      if (emailMatch) {
        const email = emailMatch[1].toLowerCase()
        // Extract name (everything before the email)
        const namePart = line.replace(emailMatch[0], '').trim()
        const name = namePart.replace(/[<>"]/g, '').trim() // Remove common Excel artifacts
        
        // Avoid duplicates
        if (!emails.find(e => e.email === email)) {
          emails.push({
            email,
            name: name || ''
          })
        }
      }
    }
    
    return emails
  }

  const handleTextChange = (text: string) => {
    setEmailText(text)
    const parsed = parseEmails(text)
    setParsedEmails(parsed)
    setError('')
  }

  const handlePreview = () => {
    const parsed = parseEmails(emailText)
    setParsedEmails(parsed)
    setShowPreview(true)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setSuccessCount(0)

    if (parsedEmails.length === 0) {
      setError('Keine gültigen E-Mail-Adressen gefunden')
      setLoading(false)
      return
    }

    try {
      let successCount = 0
      const errors: string[] = []

      // Send invitations one by one
      for (const emailData of parsedEmails) {
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
        setError(`Fehler bei ${errors.length} E-Mail(s): ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`)
      }

      if (successCount > 0) {
        setSuccess(true)
        setSuccessCount(successCount)
        setEmailText('')
        setParsedEmails([])
        setShowPreview(false)
        
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
          <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Teammitglieder einladen
        </label>
            <div className="relative group">
              <button
                type="button"
                className="w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                title="Hilfe anzeigen"
              >
                ?
              </button>
              
              {/* Hover Info Box */}
              <div className="absolute left-0 top-6 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="text-xs text-gray-600 space-y-2">
                  <p className="font-medium text-gray-800">E-Mail-Formate unterstützt:</p>
                  <div className="space-y-1">
                    <div>• <strong>Einzelne E-Mails:</strong> <code className="bg-gray-100 px-1 rounded text-xs">max@firma.ch</code></div>
                    <div>• <strong>Mit Namen:</strong> <code className="bg-gray-100 px-1 rounded text-xs">Max Muster max@firma.ch</code></div>
                    <div>• <strong>Excel-Format:</strong> <code className="bg-gray-100 px-1 rounded text-xs">max@firma.ch, anna@firma.ch</code></div>
                  </div>
                  <p className="text-gray-500 mt-2">Aus Excel kopieren und hier einfügen - funktioniert automatisch!</p>
                </div>
                {/* Arrow */}
                <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            E-Mail-Adressen *
          </label>
          <textarea
            value={emailText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="max@firma.ch&#10;Anna Muster anna@firma.ch&#10;test@example.com&#10;&#10;Oder aus Excel kopieren:&#10;max@firma.ch, anna@firma.ch, test@example.com"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 font-medium resize-none"
            rows={8}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {parsedEmails.length} E-Mail{parsedEmails.length !== 1 ? 's' : ''} erkannt
            </span>
            {parsedEmails.length > 0 && (
              <button
                type="button"
                onClick={handlePreview}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Vorschau anzeigen
              </button>
            )}
          </div>
        </div>

        {/* Preview */}
        {showPreview && parsedEmails.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Vorschau ({parsedEmails.length} E-Mails):
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {parsedEmails.map((email, index) => (
                <div key={index} className="text-xs text-blue-800 flex items-center gap-2">
                  <span className="font-mono">{email.email}</span>
                  {email.name && (
                    <span className="text-blue-600">({email.name})</span>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              Vorschau schließen
            </button>
          </div>
        )}

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
          disabled={loading || parsedEmails.length === 0}
          className={`w-full px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            loading || parsedEmails.length === 0
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {loading ? 'Wird eingeladen...' : `✉️ ${parsedEmails.length} Team-Mitglieder einladen`}
        </button>
      </form>
    </div>
  )
}

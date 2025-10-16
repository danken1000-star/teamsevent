'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface SimpleFeedbackProps {
  eventId: string
}

export default function SimpleFeedback({ eventId }: SimpleFeedbackProps) {
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [wouldPay, setWouldPay] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 || wouldPay === null) {
      setError('Bitte alle Pflichtfelder ausfüllen')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from('feedback')
        .insert({
          event_id: eventId,
          rating,
          feedback_text: feedbackText || null,
          would_pay: wouldPay,
          price_willing: wouldPay ? 79 : null
        })

      if (insertError) {
        throw insertError
      }

      setSubmitted(true)
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)

    } catch (err: any) {
      console.error('Feedback submission error:', err)
      setError('Fehler beim Speichern. Bitte versuchen Sie es erneut.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 p-8 rounded-lg text-center">
        <div className="text-4xl mb-4">🙏</div>
        <h3 className="text-xl font-bold text-green-700 mb-2">Danke für Ihr Feedback!</h3>
        <p className="text-gray-600">Sie werden in 2 Sekunden zum Dashboard weitergeleitet...</p>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        💬 Kurzes Feedback
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Wie bewerten Sie TeamEvent.ch? *
          </label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 hover:text-yellow-300'
                } transition-colors`}
              >
                ⭐
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {rating === 0 ? 'Bitte wählen' : 
             rating === 1 ? 'Sehr schlecht' :
             rating === 2 ? 'Schlecht' :
             rating === 3 ? 'Okay' :
             rating === 4 ? 'Gut' : 'Sehr gut'}
          </p>
        </div>

        {/* Feedback Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Was können wir verbessern? (Optional)
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
            placeholder="Ihre Anregungen..."
          />
        </div>

        {/* Would Pay */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Würden Sie CHF 79-149/Monat für TeamEvent.ch zahlen? *
          </label>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setWouldPay(true)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                wouldPay === true
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100'
              }`}
            >
              ✓ Ja
            </button>
            <button
              type="button"
              onClick={() => setWouldPay(false)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                wouldPay === false
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
              }`}
            >
              ✗ Nein
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0 || wouldPay === null}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Wird gespeichert...' : 'Feedback absenden'}
        </button>
      </form>
    </div>
  )
}

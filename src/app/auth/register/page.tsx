'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Passwort-Validierung
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein')
      setLoading(false)
      return
    }

    try {
      const { error: signUpError } = await signUp(email, password)
      
      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setSuccess(true)
      
      // Nach 2 Sekunden zum Login weiterleiten
setTimeout(() => {
    window.location.href = '/auth/login'
  }, 2000)
      
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-bold text-red-600">TeamsEvent</span>
            <span className="text-4xl font-bold text-gray-900">.ch</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Konto erstellen
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Starten Sie mit der mühelosen Event-Planung
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Erfolgreich registriert!
              </h3>
              <p className="text-gray-600">
                Bitte bestätigen Sie Ihre E-Mail-Adresse.
                <br />
                Sie werden zum Login weitergeleitet...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-Mail Adresse
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Passwort
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mindestens 6 Zeichen
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Passwort bestätigen
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Wird registriert...' : 'Konto erstellen'}
              </button>
            </form>
          )}

          {/* Login Link */}
          {!success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Bereits registriert?{' '}
                <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-500">
                  Jetzt anmelden
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
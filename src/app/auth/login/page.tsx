'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        setError(error.message || 'Login fehlgeschlagen')
        return
      }

      if (data.user && data.session) {
        console.log('Login successful:', data.user.email, 'Session:', data.session)
        
        // Session explizit setzen
        await supabase.auth.setSession(data.session)
        
        // Warten bis Session gesetzt ist
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Hard refresh um sicherzustellen, dass alle Cookies gesetzt sind
        window.location.href = '/dashboard'
      } else {
        setError('Keine Session erhalten')
      }
    } catch (err) {
      console.error('Login exception:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-bold text-red-600">TeamsEvent</span>
            <span className="text-4xl font-bold text-gray-900">.ch</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Willkommen zurück
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Melden Sie sich an, um Ihre Events zu verwalten
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail Adresse
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="ihre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Ihr Passwort"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/auth/register"
              className="text-sm text-red-600 hover:text-red-500"
            >
              Noch kein Konto? Jetzt registrieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
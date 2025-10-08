import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Login error:', error)
      return
    }
    
    console.log('Login successful:', data.user?.email)
    revalidatePath('/dashboard')
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
          <form action={login} className="space-y-6">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Anmelden
            </button>
          </form>
          
          <div className="mt-4">
            <Link 
              href="/dashboard" 
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Zum Dashboard (nach Login)
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Noch kein Konto?{' '}
              <Link href="/auth/register" className="font-medium text-red-600 hover:text-red-500">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
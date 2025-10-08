import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  async function register(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://teamsevent.vercel.app'}/auth/callback`,
      },
    })
    
    if (error) {
      console.error('Magic link error:', error)
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
            Konto erstellen
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Wir senden Ihnen einen Anmelde-Link per E-Mail
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form action={register} className="space-y-6">
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
                placeholder="ihre@email.com"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Magic Link senden
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              💡 Nach dem Klick: Checken Sie Ihre E-Mails und klicken Sie auf den Link!
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Bereits registriert?{' '}
              <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-500">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
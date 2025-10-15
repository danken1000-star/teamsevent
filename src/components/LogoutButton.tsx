'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    
    try {
      // Direkter Supabase Client (nicht über Wrapper)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Supabase Logout mit expliziter Scope
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      if (error) {
        console.error('Logout error:', error)
      }

      console.log('Logout successful, clearing storage and redirecting...')
      
      // Alle lokalen Storage Items löschen
      localStorage.clear()
      sessionStorage.clear()
      
      // Cookies manuell löschen (zusätzlich zu Supabase signOut)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      })
      
      // Hard refresh zur Login-Seite
      window.location.href = '/auth/login'
      
    } catch (err) {
      console.error('Logout exception:', err)
      // Trotzdem zur Login-Seite (Force Logout)
      window.location.href = '/auth/login'
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap disabled:opacity-50"
    >
      {loading ? 'Abmelden...' : 'Abmelden'}
    </button>
  )
}


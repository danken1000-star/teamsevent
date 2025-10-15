'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Supabase Logout
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
        setLoading(false)
        return
      }

      console.log('Logout successful, redirecting...')
      
      // Hard refresh zur Login-Seite (löscht alle Client-State)
      window.location.href = '/auth/login'
      
    } catch (err) {
      console.error('Logout exception:', err)
      setLoading(false)
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


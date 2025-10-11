'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Logoutbutton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // Redirect zur Landing Page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? 'Wird abgemeldet...' : '🚪 Abmelden'}
    </button>
  )
}
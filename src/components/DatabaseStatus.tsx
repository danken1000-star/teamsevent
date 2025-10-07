'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [eventCount, setEventCount] = useState<number>(0)

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { count, error } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw error
        
        setEventCount(count || 0)
        setStatus('connected')
      } catch (error) {
        console.error('Database error:', error)
        setStatus('error')
      }
    }
    
    checkDatabase()
  }, [])

  return (
    <div className="mt-8 p-4 border rounded-lg">
      {status === 'loading' && (
        <p className="text-gray-600">Checking database...</p>
      )}
      {status === 'connected' && (
        <p className="text-green-600">✅ Database: Connected ({eventCount} events)</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">❌ Database: Error</p>
      )}
    </div>
  )
}
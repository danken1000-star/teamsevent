'use client'

import { useEffect, useState } from 'react'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'

export default function DashboardStats() {
  const [stats, setStats] = useState({ events: 0, participants: 0, budget: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const supabase = createBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: events } = await supabase
        .from('events')
        .select('participant_count, budget')
        .eq('user_id', user.id)

      if (events) {
        setStats({
          events: events.length,
          participants: events.reduce((sum, e) => sum + (e.participant_count || 0), 0),
          budget: events.reduce((sum, e) => sum + (e.budget || 0), 0),
        })
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="text-gray-600 text-sm font-medium mb-1">📅 Events</div>
        <div className="text-3xl font-bold text-gray-900">{stats.events}</div>
        <div className="text-xs text-gray-500 mt-1">Insgesamt erstellt</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="text-gray-600 text-sm font-medium mb-1">👥 Teilnehmer</div>
        <div className="text-3xl font-bold text-gray-900">{stats.participants}</div>
        <div className="text-xs text-gray-500 mt-1">Total über alle Events</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="text-gray-600 text-sm font-medium mb-1">💰 Budget</div>
        <div className="text-3xl font-bold text-gray-900">
          CHF {stats.budget >= 1000 
            ? `${(stats.budget / 1000).toFixed(1)}k` 
            : stats.budget.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">Gesamtbudget</div>
      </div>
    </div>
  )
}
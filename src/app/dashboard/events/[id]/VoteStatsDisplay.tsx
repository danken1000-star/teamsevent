'use client'
import { useState, useEffect } from 'react'

interface VoteStatsDisplayProps {
  eventId: string
}

export default function VoteStatsDisplay({ eventId }: VoteStatsDisplayProps) {
  const [stats, setStats] = useState({ yes: 0, no: 0, abstain: 0 })

  useEffect(() => {
    loadStats()
    
    // Refresh stats every 5 seconds
    const interval = setInterval(loadStats, 5000)
    return () => clearInterval(interval)
  }, [eventId])

  const loadStats = async () => {
    try {
      console.log('VoteStatsDisplay: Loading stats for eventId:', eventId)
      const response = await fetch(`/api/vote/${eventId}`)
      console.log('VoteStatsDisplay: Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('VoteStatsDisplay: Received data:', data)
        setStats(data.stats)
      } else {
        console.error('VoteStatsDisplay: Failed to fetch stats:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('VoteStatsDisplay: Error loading vote stats:', error)
    }
  }

  const total = stats.yes + stats.no + stats.abstain

  if (total === 0) {
    return (
      <div className="text-xs text-gray-500 text-center">
        Noch keine Stimmen abgegeben
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-600 mb-2 text-center">
        Voting Ergebnis ({total} Stimmen)
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="font-bold text-green-600">{stats.yes}</div>
          <div className="text-gray-600">Ja</div>
        </div>
        <div>
          <div className="font-bold text-red-600">{stats.no}</div>
          <div className="text-gray-600">Nein</div>
        </div>
        <div>
          <div className="font-bold text-gray-600">{stats.abstain}</div>
          <div className="text-gray-600">Enthalte</div>
        </div>
      </div>
    </div>
  )
}

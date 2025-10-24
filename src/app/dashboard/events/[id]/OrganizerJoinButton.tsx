'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { toast } from 'sonner'

interface OrganizerJoinButtonProps {
  eventId: string
  hasJoined: boolean
}

export default function OrganizerJoinButton({ 
  eventId, 
  hasJoined 
}: OrganizerJoinButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        toast.error('Keine Email gefunden')
        return
      }

      // Add organizer to team_members
      const { data: newMember, error: memberError } = await supabase
        .from('team_members')
        .insert({
          event_id: eventId,
          name: user.email.split('@')[0],
          email: user.email
        })
        .select()
        .single()

      if (memberError) throw memberError

      // Create confirmed vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          event_id: eventId,
          team_member_id: newMember.id,
          vote_type: 'attendance',
          vote_value: 'confirmed'
        })

      if (voteError) throw voteError

      toast.success('Teilnahme bestätigt!')
      router.refresh()
    } catch (error) {
      console.error('Error joining event:', error)
      toast.error('Fehler beim Bestätigen der Teilnahme')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleJoin}
      disabled={hasJoined || loading}
      className={`
        w-full px-4 py-2 rounded-lg font-medium transition-colors
        ${hasJoined
          ? 'bg-green-100 text-green-800 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
      `}
    >
      {hasJoined ? '✓ Teilnahme bestätigt' : loading ? 'Lädt...' : 'Teilnehmen'}
    </button>
  )
}

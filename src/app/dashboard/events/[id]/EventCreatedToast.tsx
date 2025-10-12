'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export default function EventCreatedToast() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('created') === 'true') {
      toast.success('Event erfolgreich erstellt! 🎉', {
        description: 'Lade jetzt dein Team zum Abstimmen ein.',
        duration: 5000,
      })
    }
  }, [searchParams])

  return null
}
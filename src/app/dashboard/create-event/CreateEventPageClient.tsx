'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import EventDetailsStep from './EventDetailsStep'
import ActivitySelectionStep from './ActivitySelectionStep'
import ConfirmationStep from './ConfirmationStep'
import { toast } from 'sonner'

type Activity = {
  id: string
  name: string
  description: string
  category: string
  price_per_person: number
  min_persons: number
  max_persons: number
  duration_hours: number
  tags: string[]
  popular: boolean
}

export default function CreateEventPageClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const checkAuthAndKey = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      try {
        // 1) Auth Check (robust mit kurzem Retry)
        let { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          await new Promise((r) => setTimeout(r, 350))
          const sessionRes = await supabase.auth.getSession()
          user = sessionRes.data.session?.user ?? null
        }
        if (!user) {
          router.push('/auth/login')
          return
        }
        // Product-Key Logik temporär deaktiviert (MVP-Unblock)
        setReady(true)
      } catch (error) {
        console.error('Error in checkAuthAndKey:', error)
        toast.error('Fehler beim Laden. Bitte neu laden.')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndKey()
  }, [router])

  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState({
    title: '',
    budget: 2000,
    participant_count: 10,
    event_date: '',
    event_type: '',
    preferences: [] as string[]
  })
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">Lädt…</div>
    )
  }

  if (!ready) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                currentStep >= step 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-colors ${
                  currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 px-1">
          <span className={currentStep === 1 ? 'font-semibold text-red-600' : ''}>Details</span>
          <span className={currentStep === 2 ? 'font-semibold text-red-600' : ''}>Activities</span>
          <span className={currentStep === 3 ? 'font-semibold text-red-600' : ''}>Bestätigung</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        {currentStep === 1 && (
          <EventDetailsStep
            eventData={eventData}
            setEventData={setEventData}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <ActivitySelectionStep
            budget={eventData.budget}
            participantCount={eventData.participant_count}
            preferences={eventData.preferences}
            onSelect={(activities) => {
              setSelectedActivities(activities)
              nextStep()
            }}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep
            eventData={eventData}
            selectedActivities={selectedActivities}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  )
}



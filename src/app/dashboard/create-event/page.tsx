"use client"

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

export default function CreateEventPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const ensureUserHasKey = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if user has active key
      const { data: userData } = await supabase
        .from('users')
        .select('active_key_id, plan_type')
        .eq('id', user.id)
        .single()

      if (!userData?.active_key_id) {
        // MVP: Create automatic key for user
        await createAutomaticKey(user.id)
      }

      setChecking(false)
    }
    ensureUserHasKey()
  }, [router])

  const createAutomaticKey = async (userId: string) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    try {
      // Create automatic key for MVP
      const { data: keyData, error: keyError } = await supabase
        .from('product_keys')
        .insert({
          key_code: `AUTO-${Date.now()}`, // Simple auto key
          status: 'active',
          used_by: userId,
          used_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          max_events: 10, // MVP: 10 events
          events_created: 0,
          plan_type: 'mvp',
          metadata: { auto_created: true }
        })
        .select()
        .single()

      if (keyError) {
        console.error('Error creating auto key:', keyError)
        return
      }

      // Update user with active key
      const { error: userError } = await supabase
        .from('users')
        .update({
          active_key_id: keyData.id,
          plan_type: 'mvp'
        })
        .eq('id', userId)

      if (userError) {
        console.error('Error updating user:', userError)
      }

      console.log('Auto key created for user:', userId)
      
    } catch (error) {
      console.error('Error in createAutomaticKey:', error)
    }
  }

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

  if (checking) {
    return <div className="p-8 text-center text-gray-600">Überprüfe Berechtigungen…</div>
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
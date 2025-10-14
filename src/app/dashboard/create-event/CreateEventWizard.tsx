'use client'

import { useState } from 'react'
import EventDetailsStep from './EventDetailsStep'
import ActivitySelectionStep from './ActivitySelectionStep'
import ConfirmationStep from './ConfirmationStep'

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

export default function CreateEventWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState({
    title: '',
    budget: 5000,
    participant_count: 20,
    event_date: '',
    event_type: '',
    preferences: [] as string[], // ✅ NEU
  })

  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-24 mx-2 ${
                    currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={currentStep >= 1 ? 'text-red-600 font-medium' : 'text-gray-500'}>
            Details
          </span>
          <span className={currentStep >= 2 ? 'text-red-600 font-medium' : 'text-gray-500'}>
            Activities
          </span>
          <span className={currentStep >= 3 ? 'text-red-600 font-medium' : 'text-gray-500'}>
            Bestätigung
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-lg shadow-lg p-8">
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
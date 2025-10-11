'use client'

import { useState } from 'react'
import EventDetailsStep from './EventDetailsStep'
import LocationSelectionStep from './LocationSelectionStep'
import ConfirmationStep from './ConfirmationStep'

type Location = {
  id: string
  name: string
  city: string
  category: string
  price_per_person: number
  capacity_min: number
  capacity_max: number
  match_score: number
  total_cost: number
  fits_budget: boolean
}

type EventData = {
  title: string
  budget: number
  participant_count: number
  event_date: string
  selectedLocation: Location | null
}

type CreateEventWizardProps = {
  createEvent: (formData: FormData) => Promise<void>
}

export default function CreateEventWizard({ createEvent }: CreateEventWizardProps) {
  const [step, setStep] = useState(1)
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    budget: 2500,
    participant_count: 20,
    event_date: '',
    selectedLocation: null
  })

  const handleEventDetails = (data: Omit<EventData, 'selectedLocation'>) => {
    setEventData({ ...eventData, ...data })
    setStep(2)
  }

  const handleLocationSelect = (location: Location) => {
    setEventData({ ...eventData, selectedLocation: location })
    setStep(3)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">Event-Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className={`flex items-center ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">Location</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className={`flex items-center ${step >= 3 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">Bestätigung</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        {step === 1 && (
          <EventDetailsStep
            initialData={eventData}
            onNext={handleEventDetails}
          />
        )}
        
        {step === 2 && (
          <LocationSelectionStep
            budget={eventData.budget}
            participantCount={eventData.participant_count}
            onSelect={handleLocationSelect}
            onBack={handleBack}
          />
        )}
        
        {step === 3 && (
          <ConfirmationStep
            eventData={eventData}
            createEvent={createEvent}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import EventDetailsStep from './EventDetailsStep'
import LocationSelectionStep from './LocationSelectionStep'
import ConfirmationStep from './ConfirmationStep'

export default function CreateEventWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState({
    title: '',
    budget: 5000,
    participant_count: 20,
    event_date: '',
    location_id: '',
    event_type: '',  // ← NEU
  })

  const [selectedLocation, setSelectedLocation] = useState<any>(null)

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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-24 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Details
          </span>
          <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Location
          </span>
          <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
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
          <LocationSelectionStep
            budget={eventData.budget}
            participantCount={eventData.participant_count}
            onSelect={(location) => {
              setSelectedLocation(location)
              setEventData({ ...eventData, location_id: location.id })
              nextStep()
            }}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep
            eventData={eventData}
            selectedLocation={selectedLocation}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  )
}
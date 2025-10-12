'use client'

import { useState } from 'react'
import EventDetailsStep from './EventDetailsStep'
import LocationSelectionStep from './LocationSelectionStep'
import ConfirmationStep from './ConfirmationStep'

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState({
    title: '',
    budget: 2000,
    participant_count: 10,
    event_date: '',
    event_type: '',
    location_id: ''
  })
  const [selectedLocation, setSelectedLocation] = useState<any>(null)

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-colors ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 px-1">
          <span className={currentStep === 1 ? 'font-semibold text-blue-600' : ''}>Details</span>
          <span className={currentStep === 2 ? 'font-semibold text-blue-600' : ''}>Location</span>
          <span className={currentStep === 3 ? 'font-semibold text-blue-600' : ''}>Bestätigung</span>
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
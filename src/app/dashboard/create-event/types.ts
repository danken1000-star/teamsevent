export interface EventFormData {
  eventName: string
  description: string
  eventDate: string
  startTime: string
  endTime: string
  totalBudget: number
  participantCount: number
  eventType: string
  selectedLocations: LocationOption[]
}

export interface LocationOption {
  name: string
  address: string
  pricePerPerson: number
  totalPrice: number
  capacity: number
  ranking: number
}


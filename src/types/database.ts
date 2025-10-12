export interface Event {
    id: string
    user_id: string
    title: string
    budget: number
    participant_count: number
    event_date?: string
    location_id?: string
    event_type?: string  // ← NEU
    status: string
    created_at: string
  }
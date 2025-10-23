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

export interface Location {
  id: string;
  name: string;
  city: string;
  category: string;
  price_per_person: number;
  capacity_min: number;
  capacity_max: number;
  description?: string;
  amenities?: string[];
  website?: string;
  
  // Neue Marketplace Felder
  listing_tier: 'basic' | 'premium' | 'featured';
  is_verified: boolean;
  is_active: boolean;
  booking_email?: string;
  booking_lead_time: number;
  phone?: string;
  address?: string;
  postal_code?: string;
  images?: string[];
  tags?: string[];
}
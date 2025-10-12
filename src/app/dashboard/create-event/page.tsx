import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import CreateEventWizard from './CreateEventWizard'

async function createEventWithLocation(formData: FormData) {
  'use server'
  
  const supabase = createClient()
  
  // User holen
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Nicht authentifiziert')
  }
  
  // Event erstellen MIT Location
  const { error } = await supabase
    .from('events')
    .insert([
      {
        title: formData.get('title'),
        budget: parseInt(formData.get('budget') as string),
        participant_count: parseInt(formData.get('participant_count') as string),
        event_date: formData.get('event_date') || null,
        location_id: formData.get('location_id') || null,
        status: 'planning',
        user_id: user.id
      }
    ])
  
  if (error) {
    throw error
  }
  
  // Dashboard aktualisieren
  revalidatePath('/dashboard')
  
  // Zu Dashboard weiterleiten
  redirect('/dashboard')
}

export default async function CreateEventPage() {
  const supabase = createClient()
  
  // User-Check
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Neues Event erstellen</h1>
        <p className="mt-2 text-gray-600">
          Wir finden die perfekte Location für Ihr Team-Event in 3 Schritten
        </p>
      </div>

      <CreateEventWizard />
    </div>
  )
}
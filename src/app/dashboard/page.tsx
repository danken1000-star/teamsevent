import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DeleteEventButton from './DeleteEventButton'
import EditEventButton from './EditEventButton'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // User-Check
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }
  
  // Events vom eingeloggten User holen MIT Location-Details
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      locations (
        id,
        name,
        city,
        category,
        price_per_person
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Willkommen zurück, {user.email}
        </p>
      </div>

      <div className="flex gap-4 mb-8 flex-wrap">
        <a
          href="/locations"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          🏢 15 Event-Locations entdecken
        </a>
        
        <a
          href="/dashboard/create-event"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          ➕ Neues Event erstellen
        </a>
        
        <a
          href="/dashboard/match-locations"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
        >
          🎯 Location Matching testen
        </a>
      </div>

      {/* Event Liste */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Ihre Events</h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="text-red-600 mb-4">
              Fehler beim Laden der Events: {error.message}
            </div>
          )}
          
          {!events || events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Noch keine Events erstellt</p>
              
              <a
                href="/dashboard/create-event"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Erstes Event erstellen
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <a
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-red-300 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      
                      {/* Event-Typ Badge - NEU! */}
                      {event.event_type && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            📋 {event.event_type}
                          </span>
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>💰 Budget: CHF {event.budget?.toLocaleString('de-CH')}</p>
                          <p>👥 Teilnehmer: {event.participant_count}</p>
                          {event.event_date && (
                            <p>📅 Datum: {new Date(event.event_date).toLocaleDateString('de-CH')}</p>
                          )}
                          <p>📊 Status: <span className="capitalize">{event.status || 'planning'}</span></p>
                        </div>
                        
                        {/* Location Details */}
                        {event.locations && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs font-medium text-blue-900 mb-1">📍 Location</p>
                            <p className="font-semibold text-gray-900">{event.locations.name}</p>
                            <p className="text-sm text-gray-600">{event.locations.city}</p>
                            <div className="mt-2 text-xs text-gray-600">
                              <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800">
                                {event.locations.category}
                              </span>
                              <span className="ml-2">
                                CHF {event.locations.price_per_person}/Person
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className="text-xs text-gray-500">
                        {new Date(event.created_at).toLocaleDateString('de-CH')}
                      </span>
                      <div className="flex gap-2">
                        <EditEventButton eventId={event.id} />
                        <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
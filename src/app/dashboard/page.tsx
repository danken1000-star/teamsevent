import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DeleteEventButton from './DeleteEventButton'
import EditEventButton from './EditEventButton'
import DashboardStats from './components/DashboardStats'
import EmptyState from './components/EmptyState'

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
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 truncate">
          Willkommen zurück, {user.email}
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 flex-wrap">
        <a
          href="/locations"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
        >
          🏢 <span className="hidden sm:inline">15 Event-</span>Locations
        </a>
        
        <a
          href="/dashboard/create-event"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
        >
          ➕ <span className="hidden sm:inline">Neues </span>Event<span className="hidden sm:inline"> erstellen</span>
        </a>
        
        <a
          href="/dashboard/match-locations"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
        >
          🎯 Matching<span className="hidden sm:inline"> testen</span>
        </a>
      </div>

      {/* Event Liste */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Ihre Events</h2>
        </div>
        
        <div className="p-3 sm:p-6">
          {error && (
            <div className="text-red-600 mb-4 text-sm">
              Fehler beim Laden der Events: {error.message}
            </div>
          )}
          
          {!events || events.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {events.map((event) => (
                <a
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="block border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-red-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate">
                        {event.title}
                      </h3>
                      
                      {/* Event-Typ Badge */}
                      {event.event_type && (
                        <div className="mb-2 sm:mb-3">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800">
                            📋 {event.event_type}
                          </span>
                        </div>
                      )}
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-3">
                        {/* Left Column */}
                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <p>💰 Budget: CHF {event.budget?.toLocaleString('de-CH')}</p>
                          <p>👥 Teilnehmer: {event.participant_count}</p>
                          {event.event_date && (
                            <p>📅 Datum: {new Date(event.event_date).toLocaleDateString('de-CH')}</p>
                          )}
                          <p>📊 Status: <span className="capitalize">{event.status || 'planning'}</span></p>
                        </div>
                        
                        {/* Location Details */}
                        {event.locations && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                            <p className="text-xs font-medium text-blue-900 mb-1">📍 Location</p>
                            <p className="font-semibold text-sm text-gray-900 truncate">{event.locations.name}</p>
                            <p className="text-xs text-gray-600 truncate">{event.locations.city}</p>
                            <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 text-xs text-gray-600">
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                {event.locations.category}
                              </span>
                              <span>
                                CHF {event.locations.price_per_person}/Person
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:ml-4 justify-between sm:justify-start">
                      <span className="text-xs text-gray-500 sm:order-1">
                        {new Date(event.created_at).toLocaleDateString('de-CH')}
                      </span>
                      <div className="flex gap-2 sm:order-2">
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
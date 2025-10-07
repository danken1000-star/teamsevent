import { createClient } from '@/lib/supabase'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Events aus der Datenbank holen
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Verwalten Sie Ihre Mitarbeiter-Events</p>
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
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>💰 Budget: CHF {event.budget?.toLocaleString('de-CH')}</p>
                        <p>👥 Teilnehmer: {event.participant_count}</p>
                        {event.event_date && (
                          <p>📅 Datum: {new Date(event.event_date).toLocaleDateString('de-CH')}</p>
                        )}
                        <p>📊 Status: <span className="capitalize">{event.status || 'planning'}</span></p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleDateString('de-CH')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
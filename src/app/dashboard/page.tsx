import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DeleteEventButton from './DeleteEventButton'
import EditEventButton from './EditEventButton'
import DashboardStats from './components/DashboardStats'
import EmptyState from './components/EmptyState'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }
  
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-red-600">TeamEvent</span>
              <span className="text-black">.ch</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
              <form action="/auth/logout" method="post">
                <button className="text-sm text-gray-600 hover:text-black">
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Header with Big CTA */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-6">Ihre Team-Events im Überblick</p>
          
          {/* Primary Action - Big & Prominent */}
          <Link
            href="/dashboard/create-event"
            className="inline-block px-10 py-4 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
          >
            + Neues Event erstellen
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Secondary Actions - Clean & Minimal */}
        <div className="flex gap-4 mb-8 justify-center">
          <Link
            href="/locations"
            className="px-6 py-3 bg-white text-black rounded-lg border-2 border-gray-200 hover:border-red-600 transition-colors font-semibold"
          >
            🏢 Locations ansehen
          </Link>
        </div>

        {/* Events Section */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Ihre Events</h2>
          
          {error && (
            <div className="bg-red-50 border-2 border-red-600 text-red-800 px-6 py-4 rounded-xl mb-6">
              Fehler beim Laden: {error.message}
            </div>
          )}
          
          {!events || events.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-red-600 transition-all p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                    {/* Left: Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-black mb-2">
                            {event.title}
                          </h3>
                          
                          {event.event_type && (
                            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                              {event.event_type}
                            </span>
                          )}
                        </div>
                        
                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                          event.status === 'finalized' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status === 'finalized' ? '✓ Finalisiert' : 'In Planung'}
                        </span>
                      </div>
                      
                      {/* Event Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Budget & Teilnehmer</p>
                          <p className="text-lg font-semibold text-black">
                            CHF {event.budget?.toLocaleString('de-CH')} • {event.participant_count} Personen
                          </p>
                        </div>
                        
                        {event.event_date && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Datum</p>
                            <p className="text-lg font-semibold text-black">
                              {new Date(event.event_date).toLocaleDateString('de-CH', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Location Card */}
                      {event.locations && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 mb-2">📍 LOCATION</p>
                          <p className="text-lg font-bold text-black">{event.locations.name}</p>
                          <p className="text-sm text-gray-600 mb-2">{event.locations.city}</p>
                          <div className="flex gap-2 items-center text-sm">
                            <span className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-gray-800 font-medium">
                              {event.locations.category}
                            </span>
                            <span className="text-gray-600">
                              CHF {event.locations.price_per_person}/Person
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right: Actions */}
                    <div className="flex lg:flex-col gap-3 justify-between lg:justify-start lg:min-w-[180px]">
                      <Link
                        href={`/dashboard/events/${event.id}`}
                        className="flex-1 lg:flex-none px-6 py-3 bg-red-600 text-white text-center rounded-xl font-bold hover:bg-red-700 transition-colors"
                      >
                        Event öffnen →
                      </Link>
                      
                      <div className="flex gap-2 lg:flex-col lg:w-full">
                        <EditEventButton eventId={event.id} />
                        <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                      </div>
                      
                      <div className="hidden lg:block text-xs text-gray-500 text-center mt-auto">
                        Erstellt: {new Date(event.created_at).toLocaleDateString('de-CH')}
                      </div>
                    </div>
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
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function LocationsPage() {
  const supabase = createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('city', { ascending: true })

  if (error) {
    return <div>Error loading locations: {error.message}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-red-600">TeamsEvent</span>
                <span className="text-2xl font-bold text-gray-900">.ch</span>
              </Link>
              
              {/* Navigation Links */}
              <div className="ml-10 flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  🏠 Home
                </Link>
                {user && (
                  <Link 
                    href="/dashboard" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    📊 Dashboard
                  </Link>
                )}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Link
                    href="/dashboard/create-event"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    ➕ Event erstellen
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Jetzt starten
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Event Locations
          </h1>
          <p className="mt-2 text-gray-600">
            {locations?.length || 0} Schweizer Locations für Ihr Team-Event
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations?.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-500">📍 {location.city}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {location.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {location.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">👥 Kapazität:</span>
                    {location.capacity_min} - {location.capacity_max} Personen
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">💰 Preis:</span>
                    CHF {location.price_per_person}/Person
                  </div>
                </div>

                {location.amenities && location.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {location.amenities.slice(0, 3).map((amenity: string) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {amenity.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {location.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{location.amenities.length - 3} mehr
                      </span>
                    )}
                  </div>
                )}

                {location.website && (
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Website besuchen →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
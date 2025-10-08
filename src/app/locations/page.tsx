import { createClient } from '@/lib/supabase'

export default async function LocationsPage() {
  const supabase = await createClient()
  
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('city', { ascending: true })

  if (error) {
    return <div>Error loading locations: {error.message}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
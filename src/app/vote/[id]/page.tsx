import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function PublicVotePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Lade Event + Activities ohne Auth (setzt RLS voraus)
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: eventActivities } = await supabase
    .from('event_activities')
    .select(`
      *,
      activities (
        id,
        name,
        description,
        category,
        price_per_person,
        duration_hours
      )
    `)
    .eq('event_id', params.id)
    .order('order_index', { ascending: true })

  const activities = (eventActivities || [])
    .map((ea: any) => ea.activities)
    .filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team-Voting</h1>
        {event ? (
          <p className="text-gray-600 mt-1">Event: {event.title}</p>
        ) : (
          <p className="text-gray-600 mt-1">Event nicht gefunden.</p>
        )}
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((a: any, idx: number) => (
            <div key={a.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{idx + 1}. {a.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                </div>
                <p className="text-sm text-gray-700 whitespace-nowrap ml-4">
                  CHF {a.price_per_person}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded p-4">
          Noch keine Activities vorhanden.
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <p>
          Dies ist eine öffentliche Voting-Vorschau. Der eigentliche Abstimmungsfluss kann hier erweitert werden.
        </p>
        <p className="mt-2">
          Zurück zum{' '}
          <Link href="/" className="text-red-600 hover:underline">Start</Link>.
        </p>
      </div>
    </div>
  )
}
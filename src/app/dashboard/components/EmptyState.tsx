import Link from 'next/link'

export default function EmptyState() {
  return (
    <div className="text-center py-16 px-4">
      {/* Icon */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4">
          <span className="text-5xl">🎉</span>
        </div>
      </div>

      {/* Headline */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Noch keine Events erstellt
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Erstelle dein erstes Team-Event und finde die perfekte Location für dein Team!
      </p>

      {/* CTA Button */}
      <Link
        href="/dashboard/create-event"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span className="text-xl">✨</span>
        Erstes Event erstellen
      </Link>

      {/* Features/Benefits */}
      <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="text-3xl mb-3">⚡</div>
          <h4 className="font-semibold text-gray-900 mb-2">In 3 Schritten</h4>
          <p className="text-sm text-gray-600">
            Event-Details eingeben, Location wählen, fertig! Schnell und einfach.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
          <div className="text-3xl mb-3">👥</div>
          <h4 className="font-semibold text-gray-900 mb-2">Team-Voting</h4>
          <p className="text-sm text-gray-600">
            Dein Team kann ohne Login abstimmen. Einfach Link teilen!
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
          <div className="text-3xl mb-3">🎯</div>
          <h4 className="font-semibold text-gray-900 mb-2">Perfekte Locations</h4>
          <p className="text-sm text-gray-600">
            Über 15 geprüfte Event-Locations in der Schweiz. Von Bowling bis Workshop.
          </p>
        </div>
      </div>

      {/* Secondary Action */}
      <div className="mt-8">
        <Link
          href="/locations"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          Oder erst mal Locations entdecken →
        </Link>
      </div>
    </div>
  )
}
import Link from 'next/link'

export default function EmptyState() {
  return (
    <div className="text-center py-8 sm:py-16 px-4">
      {/* Icon */}
      <div className="mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4">
          <span className="text-4xl sm:text-5xl">🎉</span>
        </div>
      </div>

      {/* Headline */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
        Noch keine Events erstellt
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
        Erstelle dein erstes Team-Event und finde die perfekte Location für dein Team!
      </p>

      {/* CTA Button */}
      <Link
        href="/dashboard/create-event"
        className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        <span className="text-lg sm:text-xl">✨</span>
        Erstes Event erstellen
      </Link>

      {/* Features/Benefits */}
      <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">⚡</div>
          <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">In 3 Schritten</h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Event-Details eingeben, Location wählen, fertig! Schnell und einfach.
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">👥</div>
          <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">Team-Voting</h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Dein Team kann ohne Login abstimmen. Einfach Link teilen!
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-left sm:col-span-2 lg:col-span-1">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎯</div>
          <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">Perfekte Locations</h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Über 15 geprüfte Event-Locations in der Schweiz. Von Bowling bis Workshop.
          </p>
        </div>
      </div>

      {/* Secondary Action */}
      <div className="mt-6 sm:mt-8">
        <Link
          href="/locations"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          Oder erst mal Locations entdecken →
        </Link>
      </div>
    </div>
  )
}
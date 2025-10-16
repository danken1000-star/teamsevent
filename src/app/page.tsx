import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
  
  const { count: locationCount } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Top Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-red-600">TeamsEvent</span>
              <span className="text-black">.ch</span>
            </Link>
            
            <Link
              href={user ? "/dashboard" : "/auth/login"}
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              {user ? "Dashboard" : "Jetzt starten"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Big & Bold */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        {/* Live Badge */}
        <div className="inline-block mb-8">
          <span className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            ✓ Live • {eventCount || 0} Events • {locationCount || 0} Locations
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
          Team-Events in<br />
          <span className="text-red-600">30 Minuten</span>
        </h1>

        <p className="text-2xl text-gray-600 mb-4">
          Statt Stunden an Planung
        </p>

        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
          Die erste Schweizer Software für automatisierte Event-Planung –
          sparen Sie Zeit, Geld und Nerven.
        </p>

        {/* Big CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href={user ? "/dashboard" : "/auth/login"}
            className="px-12 py-5 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
          >
            {user ? "Zum Dashboard →" : "Kostenlos starten →"}
          </Link>
          
          <Link
            href="/locations"
            className="px-12 py-5 bg-white text-black text-lg font-semibold rounded-xl border-2 border-black hover:bg-gray-50 transition-colors"
          >
            {locationCount || 15} Locations ansehen
          </Link>
        </div>

        {/* Trust Badges - Simple */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
          <span>✓ 100% Schweizer Lösung</span>
          <span>✓ DSGVO Konform</span>
          <span>✓ Keine Kreditkarte nötig</span>
        </div>
      </div>

      {/* Value Props - Big Cards */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-black mb-16">
            Warum TeamEvent.ch?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-2xl border-2 border-gray-200 hover:border-red-600 transition-colors">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-black mb-4">
                30 Min statt Stunden
              </h3>
              <p className="text-gray-600 text-lg">
                Automatisierte Event-Planung spart massive Zeit. Von der Idee zum fertigen Event in unter 30 Minuten.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-2xl border-2 border-gray-200 hover:border-red-600 transition-colors">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-2xl font-bold text-black mb-4">
                CHF 3'000 gespart
              </h3>
              <p className="text-gray-600 text-lg">
                Bei 4 Events pro Jahr sparen Sie 60 Stunden Organisationszeit. Das entspricht CHF 3'000+ an Arbeitszeit - für nur CHF 150/Monat.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-2xl border-2 border-gray-200 hover:border-red-600 transition-colors">
              <div className="text-5xl mb-6">🇨🇭</div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Swiss Quality
              </h3>
              <p className="text-gray-600 text-lg">
                Geprüfte Schweizer Locations, DSGVO-konform, mehrsprachig. Made in Switzerland.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-black mb-16">
            So einfach geht's
          </h2>

          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h4 className="text-xl font-bold text-black mb-3">Event-Details</h4>
              <p className="text-gray-600">Budget & Teilnehmer eingeben</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h4 className="text-xl font-bold text-black mb-3">Location wählen</h4>
              <p className="text-gray-600">Automatische Vorschläge erhalten</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h4 className="text-xl font-bold text-black mb-3">Team einladen</h4>
              <p className="text-gray-600">Abstimmung per Link teilen</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                4
              </div>
              <h4 className="text-xl font-bold text-black mb-3">Fertig!</h4>
              <p className="text-gray-600">Event ist geplant & gebucht</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA - Red Section */}
      <div className="bg-red-600 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Bereit für Ihr nächstes Team-Event?
          </h2>
          <p className="text-xl text-red-100 mb-10">
            Starten Sie kostenlos - keine Kreditkarte erforderlich
          </p>
          <Link
            href={user ? "/dashboard" : "/auth/login"}
            className="inline-block px-12 py-5 bg-white text-red-600 text-lg font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
          >
            {user ? "Zum Dashboard →" : "Jetzt kostenlos starten →"}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white text-sm">
            © 2025 TeamsEvent.ch - Made with ❤️ in Switzerland
          </p>
        </div>
      </footer>
    </div>
  )
}
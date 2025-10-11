import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  // Event Count
  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
  
  // Location Count
  const { count: locationCount } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
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
                  href="/locations" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  🏢 Locations
                </Link>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    📊 Dashboard
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-red-600">Teams</span>Event.ch
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-semibold">
            Von 15 Stunden zu 30 Minuten
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Die erste Schweizer Software für mühelose Mitarbeiter-Events.
            Automatisierte Event-Planung spart Ihnen CHF 3&apos;000 pro Event.
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-green-50 border border-green-200 rounded-full mb-12">
            <span className="text-green-700 font-medium">
              ✅ {eventCount || 0} Events
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-green-700 font-medium">
              🏢 {locationCount || 0} Locations
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-green-700 font-medium">
              🚀 Live
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href={user ? "/dashboard" : "/auth/login"}
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg text-lg"
            >
              {user ? "Zum Dashboard" : "Jetzt starten"}
            </Link>
            <Link
              href="/locations"
              className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg border-2 border-red-600 text-lg"
            >
              📍 {locationCount || 15} Event-Locations entdecken
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                30 Minuten statt 15 Stunden
              </h3>
              <p className="text-gray-600">
                Automatisierte Event-Planung spart massive Zeit bei der Organisation
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                CHF 3&apos;000 Ersparnis
              </h3>
              <p className="text-gray-600">
                ROI bereits beim ersten Event durch Zeitersparnis vs. CHF 150/Monat
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🇨🇭</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                100% Schweizer Lösung
              </h3>
              <p className="text-gray-600">
                Lokale Locations, Swiss Compliance, Mehrsprachig (DE/FR/IT/EN)
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              So funktioniert&apos;s
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Budget & Teilnehmer</h4>
                <p className="text-sm text-gray-600">Geben Sie Ihr Budget und die Anzahl Teilnehmer ein</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Automatisches Matching</h4>
                <p className="text-sm text-gray-600">Wir finden die perfekte Location basierend auf Ihren Kriterien</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Team Abstimmung</h4>
                <p className="text-sm text-gray-600">Ihr Team stimmt über Datum und Location ab</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fertig!</h4>
                <p className="text-sm text-gray-600">Event ist geplant und Ihr Team wird informiert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
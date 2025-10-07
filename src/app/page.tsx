import TestComponent from '@/components/TestComponent'
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center text-gray-900">
          TeamsEvent.ch
        </h1>
        <p className="text-xl text-center mt-6 text-gray-600">
          Mühelose Mitarbeiterevents für Schweizer Teams
        </p>
        <div className="text-center mt-10">
          <button className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700">
            🇨🇭 Beta testen
          </button>
        </div>
        <TestComponent />
      </div>
    </div>
  )
}
import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from 'sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      
      {/* Mobile-Optimized Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link href="/dashboard" className="text-lg sm:text-xl font-bold text-blue-600 flex-shrink-0">
              TeamsEvent.ch
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/create-event"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Event erstellen
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] sm:max-w-none">
                {user.email}
              </span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-2 pb-3 overflow-x-auto">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-50 whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/create-event"
              className="text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-50 whitespace-nowrap"
            >
              + Event
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  )
}
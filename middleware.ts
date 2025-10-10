import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths die immer erreichbar sind
  const isPublicPath = path === '/' || path === '/locations' || path.startsWith('/auth/')
  
  // Wenn es eine öffentliche Route ist, einfach durchlassen
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Für protected routes: Echte Session-Validierung
  const { supabase, response } = createMiddlewareClient(request)
  
  try {
    // Versuche Session zu bekommen
    const { data: { session }, error } = await supabase.auth.getSession()
    
    console.log('Middleware - Path:', path, 'Has session:', !!session, 'Error:', error?.message)
    
    // Wenn keine Session -> redirect zu login
    if (!session) {
      console.log('Redirecting unauthenticated user to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    // Wenn User eingeloggt ist und auf /auth/login geht -> redirect zu dashboard
    if (path.startsWith('/auth/') && session) {
      console.log('Redirecting authenticated user to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // Bei Fehler: redirect zu login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
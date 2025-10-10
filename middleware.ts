import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths die immer erreichbar sind
  const isPublicPath = path === '/' || path === '/locations' || path.startsWith('/auth/')
  
  // Wenn es eine öffentliche Route ist, einfach durchlassen
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Für protected routes: Prüfe alle möglichen Supabase Auth Cookies
  const allCookies = request.cookies.getAll()
  const hasAuthCookie = allCookies.some(cookie => 
    cookie.name.includes('sb-') && cookie.name.includes('auth') ||
    cookie.name.includes('supabase') ||
    cookie.name.includes('access-token') ||
    cookie.name.includes('refresh-token')
  )
  
  console.log('Middleware - Path:', path, 'Has auth cookie:', hasAuthCookie, 'All cookies:', allCookies.map(c => c.name))
  
  // Wenn auf protected route ohne auth cookie -> redirect zu login
  if (!hasAuthCookie) {
    console.log('Redirecting unauthenticated user to login')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return NextResponse.next()
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
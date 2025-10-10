import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths die immer erreichbar sind
  const isPublicPath = path === '/' || path === '/locations' || path.startsWith('/auth/')
  
  // Einfache Cookie-Prüfung für Supabase Auth Token
  const authToken = request.cookies.get('sb-access-token') || 
                   request.cookies.get('sb-refresh-token') ||
                   request.cookies.get('supabase-auth-token')
  
  // Debug: Log cookie status
  console.log('Middleware - Path:', path, 'Auth token exists:', !!authToken, 'Is public:', isPublicPath)
  
  // Wenn auf protected route ohne auth token -> redirect zu login
  if (!isPublicPath && !authToken) {
    console.log('Redirecting unauthenticated user to login')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
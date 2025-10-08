import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths die immer erreichbar sind
  const isPublicPath = path === '/' || path === '/locations' || path.startsWith('/auth/')
  
  // Check ob Session Cookie existiert
  const token = request.cookies.get('sb-trsimtgvnueickftwxhl-auth-token')
  
  // Wenn auf protected route ohne token -> redirect zu login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Wenn auf login/register MIT token -> redirect zu dashboard
  if (path.startsWith('/auth/') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
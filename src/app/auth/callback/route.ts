import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    
    // Redirect to login with error message
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('error', errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  // Exchange code for session
  if (code) {
    const supabase = createClient()
    
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('error', 'Login fehlgeschlagen')
        return NextResponse.redirect(loginUrl)
      }
    } catch (err) {
      console.error('Callback exception:', err)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Ein Fehler ist aufgetreten')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Successful login - redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
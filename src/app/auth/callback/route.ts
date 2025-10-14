import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('error', errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  const supabase = createClient()

  // Handle Magic Link / Email Confirmation (token_hash)
  if (token_hash && type) {
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      })
      
      if (verifyError) {
        console.error('Token verification error:', verifyError)
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('error', 'Magic Link ungültig oder abgelaufen')
        return NextResponse.redirect(loginUrl)
      }

      // Success - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (err) {
      console.error('Verify exception:', err)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Ein Fehler ist aufgetreten')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle OAuth code exchange (for OAuth providers like Google, etc.)
  if (code) {
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('error', 'Login fehlgeschlagen')
        return NextResponse.redirect(loginUrl)
      }

      // Success - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (err) {
      console.error('Callback exception:', err)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Ein Fehler ist aufgetreten')
      return NextResponse.redirect(loginUrl)
    }
  }

  // No token or code provided
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('error', 'Kein gültiger Login-Link')
  return NextResponse.redirect(loginUrl)
}
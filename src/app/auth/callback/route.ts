import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  // Get all possible auth parameters
  const token_hash = requestUrl.searchParams.get('token_hash')
  const token = requestUrl.searchParams.get('token') // PKCE token
  const type = requestUrl.searchParams.get('type')
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('Auth callback params:', { token_hash, token, type, code, error })

  // Handle errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('error', errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  const supabase = createClient()

  // For PKCE flow, Supabase already verified the token
  // We just need to check if session exists
  if (token && type) {
    try {
      console.log('PKCE flow detected, checking session...')
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      console.log('Session check result:', { hasSession: !!session, error: sessionError })
      
      if (session) {
        console.log('Session exists! Redirecting to dashboard...')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // If no session, redirect to login
      console.error('No session found after PKCE redirect')
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Bitte versuchen Sie es erneut')
      return NextResponse.redirect(loginUrl)
      
    } catch (err) {
      console.error('PKCE session check exception:', err)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Ein Fehler ist aufgetreten')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle code exchange (OAuth providers)
  if (code) {
    try {
      console.log('Attempting code exchange...')
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('error', 'Login fehlgeschlagen')
        return NextResponse.redirect(loginUrl)
      }

      console.log('Code exchange successful!')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (err) {
      console.error('Callback exception:', err)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Ein Fehler ist aufgetreten')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle token_hash flow (older magic link format)
  if (token_hash && type) {
    try {
      console.log('Attempting token_hash verification...')
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      })
      
      if (verifyError) {
        console.error('Token hash verification error:', verifyError)
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('error', 'Magic Link ungültig oder abgelaufen')
        return NextResponse.redirect(loginUrl)
      }

      console.log('Token hash verification successful!')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (err) {
      console.error('Verify exception:', err)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Ein Fehler ist aufgetreten')
      return NextResponse.redirect(loginUrl)
    }
  }

  // No valid auth parameters
  console.error('No valid auth parameters found')
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('error', 'Kein gültiger Login-Link')
  return NextResponse.redirect(loginUrl)
}
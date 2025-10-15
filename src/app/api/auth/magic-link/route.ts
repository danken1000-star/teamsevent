import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail Adresse erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Use explicit URL (not dynamic origin) to avoid www/non-www issues
    const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL 
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
      : `${request.nextUrl.origin}/auth/callback`

    console.log('Magic link redirect URL:', redirectUrl)

    // Magic Link senden mit längeren Gültigkeitsdauer (24h statt 1h)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: true, // Erstellt User automatisch falls nicht vorhanden
        data: {
          // Zusätzliche User-Daten (optional)
        }
      },
    })

    if (error) {
      console.error('Magic Link error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Magic Link gesendet',
    })
  } catch (error) {
    console.error('Magic Link exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
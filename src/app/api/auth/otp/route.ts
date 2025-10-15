import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token, action } = body

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail Adresse erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // ACTION 1: Code senden
    if (action === 'send') {
      console.log('Sending OTP to:', email)
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Erstellt User automatisch
        },
      })

      if (error) {
        console.error('OTP send error:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Code gesendet',
        success: true
      })
    }

    // ACTION 2: Code verifizieren
    if (action === 'verify') {
      if (!token) {
        return NextResponse.json(
          { error: 'Code erforderlich' },
          { status: 400 }
        )
      }

      console.log('Verifying OTP for:', email)

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      })

      if (error) {
        console.error('OTP verify error:', error)
        
        // Spezifische Fehlermeldungen
        if (error.message.includes('expired')) {
          return NextResponse.json(
            { error: 'Code ist abgelaufen. Bitte fordern Sie einen neuen Code an.' },
            { status: 400 }
          )
        }
        
        if (error.message.includes('invalid')) {
          return NextResponse.json(
            { error: 'Falscher Code. Bitte versuchen Sie es erneut.' },
            { status: 400 }
          )
        }

        return NextResponse.json(
          { error: 'Verifizierung fehlgeschlagen' },
          { status: 500 }
        )
      }

      console.log('OTP verified successfully for:', data.user?.email)

      return NextResponse.json({
        message: 'Erfolgreich angemeldet',
        success: true,
        user: data.user
      })
    }

    return NextResponse.json(
      { error: 'Ungültige Aktion' },
      { status: 400 }
    )

  } catch (error) {
    console.error('OTP route exception:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}


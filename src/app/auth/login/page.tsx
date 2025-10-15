'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(300) // 5 Minuten
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown Timer
  useEffect(() => {
    if (step === 'code' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Step 1: Email senden
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'send' }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Fehler beim Senden des Codes')
        return
      }

      setStep('code')
      setCountdown(300) // Reset timer
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      console.error('Send code error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Code eingeben und verifizieren
  const handleCodeChange = (index: number, value: string) => {
    // Nur Zahlen erlauben
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-focus zum nächsten Feld
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit wenn alle 6 Ziffern eingegeben
    if (newCode.every(digit => digit) && index === 5) {
      verifyCode(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setCode(newCode)
    
    if (pastedData.length === 6) {
      verifyCode(pastedData)
    }
  }

  const verifyCode = async (codeString: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          token: codeString, 
          action: 'verify' 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Falscher Code')
        // Code-Felder leeren bei Fehler
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }

      // Erfolg! Redirect zum Dashboard
      console.log('OTP verified, redirecting to dashboard')
      router.push('/dashboard')
      router.refresh()
      
    } catch (err) {
      console.error('Verify code error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten')
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setCode(['', '', '', '', '', ''])
    setError('')
    await handleSendCode({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-bold text-red-600">TeamsEvent</span>
            <span className="text-4xl font-bold text-gray-900">.ch</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {step === 'email' ? 'Willkommen zurück' : 'Code eingeben'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'email' 
              ? 'Melden Sie sich mit Ihrem 6-stelligen Code an'
              : `Code wurde an ${email} gesendet`
            }
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {/* STEP 1: EMAIL INPUT */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-Mail Adresse
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="ihre@email.com"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Wir senden Ihnen einen 6-stelligen Code per E-Mail
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Wird gesendet...' : '📧 Code anfordern'}
              </button>
            </form>
          )}

          {/* STEP 2: CODE INPUT */}
          {step === 'code' && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  6-stelliger Code
                </label>
                
                {/* 6 Code Input Felder */}
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900"
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Countdown Timer */}
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    {countdown > 0 ? (
                      <>
                        Code gültig für{' '}
                        <span className="font-semibold text-red-600">
                          {formatTime(countdown)}
                        </span>
                      </>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Code abgelaufen
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Resend Code Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setCode(['', '', '', '', '', ''])
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading || countdown > 240} // Nur nach 1 Min erlauben
                  className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                  Code erneut senden
                </button>
              </div>

              {loading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/auth/register"
              className="text-sm text-red-600 hover:text-red-500"
            >
              Noch kein Konto? Jetzt registrieren
            </Link>
          </div>
        </div>

        {step === 'code' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tipp:</strong> Der Code wurde an {email} gesendet. Prüfen Sie auch Ihren Spam-Ordner.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

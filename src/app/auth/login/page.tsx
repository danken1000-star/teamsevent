'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient as createBrowserClient } from '@/lib/supabase-browser';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setStep('otp');
      setCountdown(300); // 5 min countdown
      toast.success('Code wurde versendet!');

      // Countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Senden');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const code = otpCode.join('');
      if (code.length !== 6) {
        toast.error('Bitte geben Sie den 6-stelligen Code ein');
        return;
      }

      const supabase = createBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (error) throw error;

      toast.success('Login erfolgreich!');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Ungültiger Code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when complete
    if (index === 5 && value && newOtp.every((digit) => digit !== '')) {
      const code = newOtp.join('');
      verifyOTP({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      setOtpCode(pastedData.split(''));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anmelden</h1>
          <p className="text-gray-600">
            {step === 'email' ? 'Geben Sie Ihre E-Mail-Adresse ein' : 'Geben Sie den 6-stelligen Code ein'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={sendOTP} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="ihre.email@firma.ch"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Wird gesendet...' : 'Code senden'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Noch kein Konto?{' '}
              <Link href="/auth/register" className="text-red-600 hover:text-red-700 font-medium">
                Registrieren
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Code aus E-Mail
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ))}
              </div>
              {countdown > 0 && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Code gültig für {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} Min
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.some((d) => !d)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Wird überprüft...' : 'Anmelden'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtpCode(['', '', '', '', '', '']);
              }}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Zurück
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

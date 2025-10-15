"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateKeyFormat } from '@/lib/keyGenerator'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

export default function ActivatePage() {
  const [keyCode, setKeyCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const activateKey = async () => {
    if (!validateKeyFormat(keyCode)) {
      toast.error('Ungültiges Key-Format')
      return
    }

    setLoading(true)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      // 1. Key prüfen
      const { data: key, error: keyError } = await supabase
        .from('product_keys')
        .select('*')
        .eq('key_code', keyCode)
        .single()

      if (keyError || !key) {
        toast.error('Key nicht gefunden')
        return
      }

      if (key.status !== 'active') {
        toast.error('Key ist nicht mehr gültig')
        return
      }

      if (key.used_by) {
        toast.error('Key wurde bereits verwendet')
        return
      }

      if (key.expires_at && new Date(key.expires_at) < new Date()) {
        toast.error('Key ist abgelaufen')
        return
      }

      // 2. User laden
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Bitte einloggen')
        router.push('/auth/login')
        return
      }

      // 3. Key aktivieren
      const { error: updateError } = await supabase
        .from('product_keys')
        .update({
          status: 'used',
          used_by: user.id,
          used_at: new Date().toISOString(),
        })
        .eq('id', key.id)

      if (updateError) throw updateError

      // 4. User updaten
      const { error: userError } = await supabase
        .from('users')
        .update({
          active_key_id: key.id,
          plan_type: key.plan_type,
        })
        .eq('id', user.id)

      if (userError) throw userError

      toast.success('Key erfolgreich aktiviert! 🎉')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Product Key aktivieren</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Key</label>
            <input
              type="text"
              value={keyCode}
              onChange={(e) => setKeyCode(e.target.value.toUpperCase())}
              placeholder="TEAM-XXXX-XXXX-XXXX"
              className="w-full border rounded px-3 py-2 font-mono"
              maxLength={19}
            />
            <p className="text-xs text-gray-500 mt-1">Format: TEAM-XXXX-XXXX-XXXX</p>
          </div>

          <button
            onClick={activateKey}
            disabled={loading || !keyCode}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Aktiviere...' : 'Key aktivieren'}
          </button>
        </div>
      </div>
    </div>
  )
}

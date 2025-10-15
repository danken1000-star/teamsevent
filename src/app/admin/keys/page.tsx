"use client";

import { useState } from 'react'
import { toast } from 'sonner'
import { generateProductKey } from '@/lib/keyGenerator'
import { createClient } from '@supabase/supabase-js'

export default function AdminKeysPage() {
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [planType, setPlanType] = useState('beta')
  const [maxEvents, setMaxEvents] = useState<number | null>(null)
  const [expiresInDays, setExpiresInDays] = useState<number | null>(90)

  const generateKeys = async () => {
    setLoading(true)
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const keys = [] as any[]
      const expiresAt = expiresInDays 
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null

      for (let i = 0; i < quantity; i++) {
        keys.push({
          key_code: generateProductKey(),
          status: 'active',
          plan_type: planType,
          max_events: maxEvents,
          expires_at: expiresAt,
        })
      }

      const { data, error } = await supabase
        .from('product_keys')
        .insert(keys)
        .select()

      if (error) throw error

      // Keys in CSV exportieren
      const csv = data.map((k: any) => k.key_code).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `keys-${Date.now()}.csv`
      a.click()

      toast.success(`${quantity} Keys erfolgreich generiert!`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Product Key Generator</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Anzahl Keys</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Plan Type</label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="beta">Beta (kostenlos)</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Events (leer = unlimited)</label>
          <input
            type="number"
            value={maxEvents ?? ''}
            onChange={(e) => setMaxEvents(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Unlimited"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gültigkeit (Tage, leer = unbegrenzt)</label>
          <input
            type="number"
            value={expiresInDays ?? ''}
            onChange={(e) => setExpiresInDays(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Unbegrenzt"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={generateKeys}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Generiere...' : `${quantity} Keys generieren`}
        </button>
      </div>
    </div>
  )
}

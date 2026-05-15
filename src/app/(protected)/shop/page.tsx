'use client'

import { useState } from 'react'
import { TOKEN_PACKAGES } from '@/types/database'

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess?: (result: unknown) => void
        onPending?: (result: unknown) => void
        onError?: (result: unknown) => void
        onClose?: () => void
      }) => void
    }
  }
}

export default function ShopPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  async function handleBuy(packageId: string) {
    setLoading(packageId)
    setMessage(null)

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error })
        setLoading(null)
        return
      }

      // Open Midtrans Snap popup
      window.snap.pay(data.token, {
        onSuccess: () => {
          setMessage({ type: 'success', text: 'Pembayaran berhasil! Token akan ditambahkan ke akun kamu.' })
          setLoading(null)
          // Reload to update token balance
          setTimeout(() => window.location.reload(), 2000)
        },
        onPending: () => {
          setMessage({ type: 'info', text: 'Pembayaran pending. Token akan ditambahkan setelah konfirmasi.' })
          setLoading(null)
        },
        onError: () => {
          setMessage({ type: 'error', text: 'Pembayaran gagal. Silakan coba lagi.' })
          setLoading(null)
        },
        onClose: () => {
          setLoading(null)
        },
      })
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' })
      setLoading(null)
    }
  }

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">🛒 Beli Token</h1>
        <p className="text-gray-400 mt-2">Pilih paket token dan bayar melalui Midtrans</p>
        <p className="text-xs text-gray-500 mt-1">Mendukung: QRIS, GoPay, OVO, ShopeePay, Bank Transfer, Kartu Kredit, dll.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-center text-sm font-medium ${
          message.type === 'success' ? 'bg-green-500/10 border border-green-500 text-green-400' :
          message.type === 'error' ? 'bg-red-500/10 border border-red-500 text-red-400' :
          'bg-blue-500/10 border border-blue-500 text-blue-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TOKEN_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all hover:transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🪙</div>
              <h3 className="text-xl font-bold">{pkg.name}</h3>
              {pkg.bonus_tokens > 0 && (
                <div className="mt-1 text-sm text-green-400 font-medium">
                  +{pkg.bonus_tokens} bonus token!
                </div>
              )}
              <div className="mt-4 text-3xl font-bold text-yellow-400">
                {pkg.tokens + pkg.bonus_tokens}
              </div>
              <div className="text-sm text-gray-400">token</div>
              <div className="mt-4 text-lg font-bold text-white">
                {formatRupiah(pkg.price)}
              </div>
              <div className="text-xs text-gray-500">
                {formatRupiah(Math.round(pkg.price / (pkg.tokens + pkg.bonus_tokens)))}/token
              </div>
            </div>

            <button
              onClick={() => handleBuy(pkg.id)}
              disabled={loading !== null}
              className={`mt-6 w-full py-3 rounded-xl font-bold transition-all ${
                loading === pkg.id
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/20'
              }`}
            >
              {loading === pkg.id ? '⏳ Memproses...' : '💳 Beli Sekarang'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment methods info */}
      <div className="mt-12 bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="font-bold text-lg mb-4">💳 Metode Pembayaran yang Didukung</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
          <div>✅ QRIS</div>
          <div>✅ GoPay</div>
          <div>✅ OVO</div>
          <div>✅ ShopeePay</div>
          <div>✅ Bank BCA</div>
          <div>✅ Bank BNI</div>
          <div>✅ Bank BRI</div>
          <div>✅ Bank Mandiri</div>
          <div>✅ Kartu Kredit/Debit</div>
          <div>✅ Alfamart</div>
          <div>✅ Indomaret</div>
          <div>✅ Akulaku</div>
        </div>
      </div>
    </div>
  )
}

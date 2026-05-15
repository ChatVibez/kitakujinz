'use client'

import { useState, useEffect } from 'react'
import type { GachaItem } from '@/types/database'
import { GACHA_COST } from '@/types/database'

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
}

const RARITY_EMOJIS: Record<string, string> = {
  common: '⚪',
  uncommon: '🟢',
  rare: '🔵',
  epic: '🟣',
  legendary: '🟡',
}

export default function GachaPage() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<GachaItem | null>(null)
  const [tokens, setTokens] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTokens()
  }, [])

  async function fetchTokens() {
    const res = await fetch('/api/user/profile')
    if (res.ok) {
      const data = await res.json()
      setTokens(data.profile.tokens)
    }
  }

  async function handleSpin() {
    if (spinning) return
    setError('')
    setShowResult(false)
    setSpinning(true)

    try {
      const res = await fetch('/api/gacha/spin', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setSpinning(false)
        return
      }

      // Wait for animation
      setTimeout(() => {
        setResult(data.item)
        setTokens(data.remaining_tokens)
        setShowResult(true)
        setSpinning(false)
      }, 2000)
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setSpinning(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">🎰 Mesin Gacha</h1>
      <p className="text-gray-400 mb-8">Gunakan {GACHA_COST} token untuk 1x spin</p>

      {/* Gacha Machine */}
      <div className="relative w-80 h-96 bg-gradient-to-b from-gray-700 to-gray-800 rounded-3xl border-4 border-gray-600 shadow-2xl flex flex-col items-center justify-center mb-8 overflow-hidden">
        {/* Top decoration */}
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500" />
        
        {/* Capsule display */}
        <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center mb-4 transition-all duration-300 ${
          spinning ? 'border-yellow-400 animate-pulse' : 'border-gray-500'
        }`}>
          {spinning ? (
            <div className="animate-spin-gacha">
              <span className="text-6xl">❓</span>
            </div>
          ) : showResult && result ? (
            <div className="animate-bounce-in text-center">
              <span className="text-5xl">{RARITY_EMOJIS[result.rarity]}</span>
              <p className="text-xs font-bold mt-2" style={{ color: RARITY_COLORS[result.rarity] }}>
                {result.rarity.toUpperCase()}
              </p>
            </div>
          ) : (
            <span className="text-6xl">🎲</span>
          )}
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={spinning || (tokens !== null && tokens < GACHA_COST)}
          className={`px-8 py-4 rounded-2xl font-bold text-xl transition-all transform ${
            spinning
              ? 'bg-gray-600 cursor-not-allowed scale-95'
              : tokens !== null && tokens < GACHA_COST
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30'
          }`}
        >
          {spinning ? '⏳ Spinning...' : `🎰 SPIN! (${GACHA_COST} 🪙)`}
        </button>

        {/* Bottom lights */}
        <div className="absolute bottom-4 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${spinning ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor: spinning
                  ? ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'][i]
                  : '#374151',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-4 mb-4 max-w-md text-center">
          {error}
        </div>
      )}

      {/* Result */}
      {showResult && result && (
        <div className="animate-bounce-in bg-gray-800 rounded-2xl p-8 border-2 max-w-md w-full text-center"
          style={{ borderColor: RARITY_COLORS[result.rarity] }}
        >
          <div className="text-sm font-bold mb-2" style={{ color: RARITY_COLORS[result.rarity] }}>
            {RARITY_EMOJIS[result.rarity]} {result.rarity.toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
          <p className="text-gray-400">{result.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            Sisa token: <span className="text-yellow-400 font-bold">{tokens} 🪙</span>
          </div>
        </div>
      )}

      {/* Token warning */}
      {tokens !== null && tokens < GACHA_COST && (
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500 text-yellow-400 rounded-lg p-4 text-center max-w-md">
          <p className="font-bold">Token tidak cukup!</p>
          <p className="text-sm mt-1">Kamu butuh minimal {GACHA_COST} token. Beli token di <a href="/shop" className="underline">Shop</a>.</p>
        </div>
      )}
    </div>
  )
}

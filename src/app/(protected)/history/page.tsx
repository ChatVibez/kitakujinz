'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface HistoryEntry {
  id: string
  created_at: string
  item: {
    name: string
    rarity: string
    description: string
  }
}

const RARITY_EMOJIS: Record<string, string> = {
  common: '⚪',
  uncommon: '🟢',
  rare: '🔵',
  epic: '🟣',
  legendary: '🟡',
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    const { data } = await supabase
      .from('gacha_history')
      .select('id, created_at, item:gacha_items(name, rarity, description)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      setHistory(data as unknown as HistoryEntry[])
    }
    setLoading(false)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">📜 Riwayat Gacha</h1>
        <p className="text-gray-400 mt-2">50 spin terakhir kamu</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <div className="text-5xl mb-4">🎲</div>
          <p>Belum ada riwayat spin. Mulai putar gacha!</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700"
            >
              <div className="text-2xl">
                {RARITY_EMOJIS[entry.item.rarity]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{entry.item.name}</h3>
                <p className="text-xs text-gray-400">{entry.item.description}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold rarity-${entry.item.rarity}`}>
                  {entry.item.rarity.toUpperCase()}
                </span>
                <p className="text-xs text-gray-500 mt-1">{formatDate(entry.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

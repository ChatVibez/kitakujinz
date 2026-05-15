'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface InventoryItem {
  id: string
  quantity: number
  item: {
    id: string
    name: string
    description: string
    rarity: string
    image_url: string
  }
}

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-400',
  uncommon: 'border-green-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
}

const RARITY_BG: Record<string, string> = {
  common: 'from-gray-700 to-gray-800',
  uncommon: 'from-green-900/30 to-gray-800',
  rare: 'from-blue-900/30 to-gray-800',
  epic: 'from-purple-900/30 to-gray-800',
  legendary: 'from-yellow-900/30 to-gray-800',
}

const RARITY_EMOJIS: Record<string, string> = {
  common: '⚪',
  uncommon: '🟢',
  rare: '🔵',
  epic: '🟣',
  legendary: '🟡',
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchInventory()
  }, [])

  async function fetchInventory() {
    const { data } = await supabase
      .from('inventory')
      .select('id, quantity, item:gacha_items(id, name, description, rarity, image_url)')
      .order('quantity', { ascending: false })

    if (data) {
      setInventory(data as unknown as InventoryItem[])
    }
    setLoading(false)
  }

  const filteredInventory = filter === 'all'
    ? inventory
    : inventory.filter(inv => inv.item.rarity === filter)

  const totalItems = inventory.reduce((sum, inv) => sum + inv.quantity, 0)

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">🎒 Inventory</h1>
        <p className="text-gray-400 mt-2">Total: {totalItems} item dari {inventory.length} jenis</p>
      </div>

      {/* Filter */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === r
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {r === 'all' ? '🌐 Semua' : `${RARITY_EMOJIS[r]} ${r.charAt(0).toUpperCase() + r.slice(1)}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : filteredInventory.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <div className="text-5xl mb-4">📦</div>
          <p>Belum ada item. Mulai putar gacha!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredInventory.map((inv) => (
            <div
              key={inv.id}
              className={`bg-gradient-to-b ${RARITY_BG[inv.item.rarity]} rounded-xl p-4 border-2 ${RARITY_COLORS[inv.item.rarity]} relative`}
            >
              {/* Quantity badge */}
              <div className="absolute top-2 right-2 bg-gray-900 rounded-full px-2 py-1 text-xs font-bold">
                x{inv.quantity}
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">{RARITY_EMOJIS[inv.item.rarity]}</div>
                <h3 className="font-bold text-sm">{inv.item.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{inv.item.description}</p>
                <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded rarity-${inv.item.rarity}`}>
                  {inv.item.rarity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

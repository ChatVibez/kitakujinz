'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Profile } from '@/types/database'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const res = await fetch('/api/user/profile')
    if (res.ok) {
      const data = await res.json()
      setProfile(data.profile)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/gacha', label: '🎰 Gacha', active: pathname === '/gacha' },
    { href: '/shop', label: '🛒 Beli Token', active: pathname === '/shop' },
    { href: '/inventory', label: '🎒 Inventory', active: pathname === '/inventory' },
    { href: '/history', label: '📜 Riwayat', active: pathname === '/history' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/gacha" className="text-xl font-bold flex items-center gap-2">
                🎰 <span className="hidden sm:inline bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">Gacha</span>
              </Link>
              <div className="flex gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-700 rounded-xl px-4 py-2">
                <span className="text-yellow-400">🪙</span>
                <span className="font-bold">{profile?.tokens ?? '...'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <div className="text-6xl mb-6">🎰</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
          Gacha Machine
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Putar mesin gacha dan dapatkan item langka! Beli token menggunakan pembayaran Midtrans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-2">Beli Token</h3>
            <p className="text-gray-400 text-sm">Deposit via Midtrans - QRIS, GoPay, OVO, Bank Transfer</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-3xl mb-3">🎰</div>
            <h3 className="font-bold text-lg mb-2">Putar Gacha</h3>
            <p className="text-gray-400 text-sm">Gunakan 5 token per spin untuk mendapatkan item</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-bold text-lg mb-2">Koleksi Item</h3>
            <p className="text-gray-400 text-sm">Kumpulkan item dari Common hingga Legendary!</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-gray-700 rounded-xl font-bold text-lg hover:bg-gray-600 transition-all transform hover:scale-105 border border-gray-600"
          >
            Daftar Gratis
          </Link>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          🎁 Bonus 10 token gratis untuk pendaftar baru!
        </p>
      </div>

      {/* Rarity showcase */}
      <div className="mt-16 w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold mb-6">Drop Rates</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="text-center p-3 rounded-lg border rarity-bg-common">
            <span className="rarity-common font-bold">Common</span>
            <p className="text-xs text-gray-400 mt-1">65%</p>
          </div>
          <div className="text-center p-3 rounded-lg border rarity-bg-uncommon">
            <span className="rarity-uncommon font-bold">Uncommon</span>
            <p className="text-xs text-gray-400 mt-1">15%</p>
          </div>
          <div className="text-center p-3 rounded-lg border rarity-bg-rare">
            <span className="rarity-rare font-bold">Rare</span>
            <p className="text-xs text-gray-400 mt-1">15%</p>
          </div>
          <div className="text-center p-3 rounded-lg border rarity-bg-epic">
            <span className="rarity-epic font-bold">Epic</span>
            <p className="text-xs text-gray-400 mt-1">4.5%</p>
          </div>
          <div className="text-center p-3 rounded-lg border rarity-bg-legendary">
            <span className="rarity-legendary font-bold">Legendary</span>
            <p className="text-xs text-gray-400 mt-1">0.5%</p>
          </div>
        </div>
      </div>
    </main>
  )
}

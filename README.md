# 🎰 Gacha Machine Web App

Web app mesin gacha dengan sistem token dan pembayaran Midtrans.

## Fitur

- 🎰 **Mesin Gacha** - Putar gacha dengan animasi dan random drop berdasarkan rarity
- 💰 **Sistem Token** - Beli token untuk bermain gacha
- 💳 **Pembayaran Midtrans** - QRIS, GoPay, OVO, ShopeePay, Bank Transfer, dll.
- 🎒 **Inventory** - Kumpulkan dan lihat koleksi item kamu
- 📜 **Riwayat** - Lihat histori spin
- 🔐 **Auth** - Register & Login dengan Supabase Auth

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payment**: Midtrans Snap
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL di `supabase/schema.sql` di SQL Editor
3. Copy URL dan Anon Key

### 3. Setup Midtrans

1. Daftar di [Midtrans](https://midtrans.com)
2. Ambil Server Key dan Client Key dari dashboard
3. Set webhook URL: `https://your-domain.com/api/payment/webhook`

### 4. Environment Variables

Copy `.env.local.example` ke `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Jalankan

```bash
npm run dev
```

## Rarity & Drop Rates

| Rarity | Drop Rate | Warna |
|--------|-----------|-------|
| Common | 65% | Abu |
| Uncommon | 15% | Hijau |
| Rare | 15% | Biru |
| Epic | 4.5% | Ungu |
| Legendary | 0.5% | Emas |

## Paket Token

| Paket | Token | Harga | Bonus |
|-------|-------|-------|-------|
| 10 Token | 10 | Rp 10.000 | - |
| 50 Token | 50 | Rp 45.000 | +5 |
| 100 Token | 100 | Rp 85.000 | +15 |
| 500 Token | 500 | Rp 400.000 | +100 |

## Alur Pembayaran

1. User pilih paket token di halaman Shop
2. Frontend request ke `/api/payment/create`
3. Backend buat transaksi di Midtrans Snap
4. User bayar via popup Midtrans
5. Midtrans kirim webhook ke `/api/payment/webhook`
6. Backend verifikasi signature dan update token user

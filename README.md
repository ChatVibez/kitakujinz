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

---

## 📋 Panduan Setup Lengkap

### Prasyarat

Pastikan sudah terinstall di komputer kamu:
- **Node.js** versi 18 atau lebih baru → [Download](https://nodejs.org)
- **npm** (sudah otomatis terinstall bersama Node.js)
- **Git** → [Download](https://git-scm.com)

---

### STEP 1: Clone Repository

```bash
git clone https://github.com/ChatVibez/kitakujinz.git
cd kitakujinz
```

---

### STEP 2: Install Dependencies

```bash
npm install
```

Tunggu sampai selesai. Ini akan menginstall Next.js, Supabase client, Midtrans client, dll.

---

### STEP 3: Setup Supabase (Database & Auth)

#### 3a. Buat Akun & Project Supabase

1. Buka https://supabase.com dan klik **"Start your project"**
2. Daftar dengan GitHub (gratis)
3. Klik **"New Project"**
4. Isi:
   - **Name**: `gacha-machine` (atau terserah)
   - **Database Password**: buat password yang kuat (simpan baik-baik)
   - **Region**: pilih **Southeast Asia (Singapore)** untuk latency terbaik
5. Klik **"Create new project"** dan tunggu ~2 menit

#### 3b. Ambil API Keys

1. Di dashboard Supabase, klik ⚙️ **Settings** (icon gear kiri bawah)
2. Pilih **API** di sidebar
3. Catat 2 hal ini:
   - **Project URL** → contoh: `https://abcdefgh.supabase.co`
   - **anon / public key** → string panjang yang dimulai `eyJhbG...`

#### 3c. Jalankan Database Schema

1. Di dashboard Supabase, klik **SQL Editor** (icon database di sidebar kiri)
2. Klik **"New query"**
3. Copy-paste **SELURUH ISI** file `supabase/schema.sql` dari project ini
4. Klik **"Run"** (tombol hijau)
5. Pastikan muncul "Success. No rows returned" (itu artinya berhasil)

> **Apa yang dilakukan schema ini?**
> - Membuat tabel: `profiles`, `gacha_items`, `inventory`, `gacha_history`, `transactions`
> - Membuat function: `perform_gacha_spin`, `add_tokens`, `handle_new_user`
> - Membuat trigger: otomatis buat profil + 10 token gratis saat user register
> - Mengisi 8 item gacha (Bronze Coin → Celestial Orb)
> - Mengaktifkan Row Level Security (RLS) agar data user aman

#### 3d. Matikan Email Confirmation (Opsional, untuk testing)

1. Di dashboard Supabase, buka **Authentication** → **Providers** → **Email**
2. Matikan toggle **"Confirm email"**
3. Klik **Save**

> Ini biar saat register tidak perlu konfirmasi email. Nyalakan kembali untuk production!

---

### STEP 4: Setup Midtrans (Payment Gateway)

#### 4a. Buat Akun Midtrans Sandbox

1. Buka https://dashboard.sandbox.midtrans.com
2. Klik **"Daftar"** dan isi data
3. Setelah login, kamu akan masuk ke **Dashboard Sandbox** (mode testing, uang tidak betulan)

#### 4b. Ambil API Keys

1. Di dashboard Midtrans, klik **Settings** → **Access Keys**
2. Catat:
   - **Server Key** → contoh: `SB-Mid-server-xxxxxxx`
   - **Client Key** → contoh: `SB-Mid-client-xxxxxxx`

#### 4c. Setup Webhook / Notification URL

1. Di dashboard Midtrans, klik **Settings** → **Configuration**
2. Di bagian **Payment Notification URL**, isi:
   ```
   https://domain-kamu.com/api/payment/webhook
   ```
   > ⚠️ Untuk development lokal, kamu perlu tool seperti [ngrok](https://ngrok.com) untuk expose localhost:
   > ```bash
   > ngrok http 3000
   > ```
   > Lalu masukkan URL ngrok + `/api/payment/webhook`, contoh:
   > ```
   > https://abc123.ngrok-free.app/api/payment/webhook
   > ```
3. Klik **Save**

#### 4d. Enable Payment Methods (Opsional)

1. Di dashboard, klik **Settings** → **Snap Preferences**
2. Aktifkan metode pembayaran yang diinginkan:
   - ✅ QRIS
   - ✅ GoPay
   - ✅ Bank Transfer (BCA, BNI, BRI, Mandiri)
   - ✅ ShopeePay
   - dll.

---

### STEP 5: Buat File Environment Variables

1. Copy file contoh:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit file `.env.local` dengan text editor (VS Code, Notepad++, dll):
   ```env
   # Supabase - dari Step 3b
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Midtrans - dari Step 4b
   MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxx
   MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxx
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxx
   MIDTRANS_IS_PRODUCTION=false

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

> ⚠️ **PENTING**: 
> - `MIDTRANS_CLIENT_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` isinya **SAMA**
> - Jangan pernah commit file `.env.local` ke Git (sudah ada di `.gitignore`)
> - Untuk production, ganti `MIDTRANS_IS_PRODUCTION=true` dan gunakan production keys

---

### STEP 6: Jalankan Project

```bash
npm run dev
```

Buka browser ke **http://localhost:3000** 🎉

---

## 🎮 Cara Pakai

### Pertama Kali:
1. Buka http://localhost:3000
2. Klik **"Daftar Gratis"**
3. Masukkan email dan password
4. Kamu langsung dapat **10 token gratis**!

### Main Gacha:
1. Masuk ke halaman **🎰 Gacha**
2. Klik tombol **"SPIN!"** (butuh 5 token per spin)
3. Tunggu animasi selesai dan lihat hasilnya!

### Beli Token:
1. Masuk ke halaman **🛒 Beli Token**
2. Pilih paket token
3. Klik **"Beli Sekarang"** → muncul popup Midtrans
4. Pilih metode pembayaran dan selesaikan
5. Token otomatis masuk ke akun kamu

### Testing Pembayaran (Sandbox):
Di mode sandbox, gunakan data test Midtrans:
- **QRIS**: scan QR yang muncul (auto-success di sandbox)
- **Kartu Kredit**:
  - Nomor: `4811 1111 1111 1114`
  - Exp: `01/25`
  - CVV: `123`
  - OTP: `112233`
- **GoPay**: klik "Simulasi Pembayaran" di popup

---

## 📁 Struktur Project

```
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # Halaman login
│   │   │   └── register/page.tsx    # Halaman register
│   │   ├── (protected)/
│   │   │   ├── gacha/page.tsx       # Mesin gacha utama
│   │   │   ├── shop/page.tsx        # Beli token
│   │   │   ├── inventory/page.tsx   # Koleksi item
│   │   │   ├── history/page.tsx     # Riwayat spin
│   │   │   └── layout.tsx           # Layout + navbar
│   │   ├── api/
│   │   │   ├── gacha/spin/route.ts  # API spin gacha
│   │   │   ├── payment/
│   │   │   │   ├── create/route.ts  # API buat pembayaran
│   │   │   │   └── webhook/route.ts # Webhook dari Midtrans
│   │   │   └── user/profile/route.ts
│   │   ├── globals.css              # CSS + animasi
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing page
│   ├── lib/
│   │   ├── midtrans.ts             # Midtrans client config
│   │   └── supabase/
│   │       ├── client.ts           # Supabase browser client
│   │       ├── server.ts           # Supabase server client
│   │       └── middleware.ts       # Auth middleware
│   ├── middleware.ts               # Next.js middleware (auth redirect)
│   └── types/
│       ├── database.ts             # TypeScript types + constants
│       └── midtrans-client.d.ts    # Midtrans type declarations
├── supabase/
│   └── schema.sql                  # Database schema (jalankan di SQL Editor)
├── .env.local.example              # Template environment variables
├── package.json
└── tsconfig.json
```

---

## 🎲 Rarity & Drop Rates

| Rarity | Drop Rate | Items |
|--------|-----------|-------|
| ⚪ Common | 65% | Bronze Coin, Silver Ring |
| 🟢 Uncommon | 15% | Emerald Gem |
| 🔵 Rare | 15% | Golden Sword, Diamond Shield |
| 🟣 Epic | 4.5% | Phoenix Feather, Dragon Crown |
| 🟡 Legendary | 0.5% | Celestial Orb |

---

## 💰 Paket Token

| Paket | Token | Harga | Bonus | Per Token |
|-------|-------|-------|-------|-----------|
| 10 Token | 10 | Rp 10.000 | - | Rp 1.000 |
| 50 Token | 55 | Rp 45.000 | +5 | Rp 818 |
| 100 Token | 115 | Rp 85.000 | +15 | Rp 739 |
| 500 Token | 600 | Rp 400.000 | +100 | Rp 667 |

---

## 🔄 Alur Sistem

### Alur Register:
```
User daftar → Supabase Auth buat user → Trigger `handle_new_user`
→ Auto-create profile dengan 10 token gratis
```

### Alur Gacha Spin:
```
User klik SPIN → POST /api/gacha/spin → Function `perform_gacha_spin`
→ Cek token cukup → Kurangi token → Random item berdasarkan drop_rate
→ Simpan ke history & inventory → Return item ke frontend
```

### Alur Pembayaran:
```
User pilih paket → POST /api/payment/create → Midtrans Snap buat transaksi
→ User bayar di popup → Midtrans kirim webhook ke /api/payment/webhook
→ Verifikasi signature SHA512 → Update status transaksi
→ Jika success, panggil `add_tokens` → Token masuk ke akun user
```

---

## 🚀 Deploy ke Vercel

1. Push code ke GitHub
2. Buka https://vercel.com dan import repository
3. Tambahkan **Environment Variables** yang sama seperti `.env.local`
4. Ganti `NEXT_PUBLIC_APP_URL` dengan domain Vercel kamu
5. Deploy!
6. Update **Notification URL** di Midtrans dengan domain Vercel

---

## ❓ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Unauthorized" saat akses halaman | Pastikan sudah login, cek Supabase URL & Key benar |
| Schema SQL error | Pastikan copy SELURUH isi file, termasuk baris pertama dan terakhir |
| Midtrans popup tidak muncul | Cek `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` sudah benar |
| Token tidak bertambah setelah bayar | Pastikan webhook URL sudah dikonfigurasi di dashboard Midtrans |
| "Insufficient tokens" | Token kurang dari 5, beli dulu di Shop |
| Register gagal | Cek apakah email confirmation dimatikan (Step 3d) |

---

## 📞 Kontak

Jika ada pertanyaan atau issue, silakan buka issue di repository ini.

export interface Profile {
  id: string
  email: string
  username: string
  tokens: number
  created_at: string
  updated_at: string
}

export interface GachaItem {
  id: string
  name: string
  description: string
  image_url: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  drop_rate: number
  created_at: string
}

export interface GachaHistory {
  id: string
  user_id: string
  item_id: string
  created_at: string
  item?: GachaItem
}

export interface Transaction {
  id: string
  user_id: string
  order_id: string
  amount: number
  tokens_purchased: number
  status: 'pending' | 'success' | 'failed' | 'expired'
  midtrans_transaction_id: string | null
  payment_type: string | null
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  user_id: string
  item_id: string
  quantity: number
  item?: GachaItem
}

// Token packages for purchase
export interface TokenPackage {
  id: string
  name: string
  tokens: number
  price: number // in IDR
  bonus_tokens: number
}

export const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 'pkg_10', name: '10 Tokens', tokens: 10, price: 10000, bonus_tokens: 0 },
  { id: 'pkg_50', name: '50 Tokens', tokens: 50, price: 45000, bonus_tokens: 5 },
  { id: 'pkg_100', name: '100 Tokens', tokens: 100, price: 85000, bonus_tokens: 15 },
  { id: 'pkg_500', name: '500 Tokens', tokens: 500, price: 400000, bonus_tokens: 100 },
]

// Gacha cost per spin
export const GACHA_COST = 5 // tokens per spin

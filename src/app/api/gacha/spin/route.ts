import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GACHA_COST } from '@/types/database'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Call the atomic gacha spin function
    const { data: itemId, error } = await supabase.rpc('perform_gacha_spin', {
      p_user_id: user.id,
      p_cost: GACHA_COST,
    })

    if (error) {
      if (error.message.includes('Insufficient tokens')) {
        return NextResponse.json({ error: 'Token tidak cukup! Silakan beli token terlebih dahulu.' }, { status: 400 })
      }
      throw error
    }

    // Get the item details
    const { data: item } = await supabase
      .from('gacha_items')
      .select('*')
      .eq('id', itemId)
      .single()

    // Get updated token balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      item,
      remaining_tokens: profile?.tokens || 0,
    })
  } catch (error) {
    console.error('Gacha spin error:', error)
    return NextResponse.json({ error: 'Failed to perform gacha spin' }, { status: 500 })
  }
}

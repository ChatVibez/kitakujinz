import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { snap } from '@/lib/midtrans'
import { TOKEN_PACKAGES } from '@/types/database'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { packageId } = await request.json()
    const selectedPackage = TOKEN_PACKAGES.find(p => p.id === packageId)

    if (!selectedPackage) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    const orderId = `GACHA-${uuidv4()}`

    // Create Midtrans Snap transaction
    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount: selectedPackage.price,
      },
      item_details: [{
        id: selectedPackage.id,
        price: selectedPackage.price,
        quantity: 1,
        name: `${selectedPackage.name}${selectedPackage.bonus_tokens > 0 ? ` (+${selectedPackage.bonus_tokens} bonus)` : ''}`,
      }],
      customer_details: {
        email: user.email,
      },
    }

    const transaction = await snap.createTransaction(transactionParams)

    // Store transaction in database
    await supabase.from('transactions').insert({
      user_id: user.id,
      order_id: orderId,
      amount: selectedPackage.price,
      tokens_purchased: selectedPackage.tokens + selectedPackage.bonus_tokens,
      status: 'pending',
    })

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}

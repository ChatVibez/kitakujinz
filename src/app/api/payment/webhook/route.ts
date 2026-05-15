import { NextRequest, NextResponse } from 'next/server'
import { coreApi } from '@/lib/midtrans'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type, transaction_id } = body

    // Verify signature from Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex')

    if (hash !== signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const supabase = await createClient()

    // Determine transaction status
    let newStatus: 'success' | 'failed' | 'pending' | 'expired' = 'pending'

    if (transaction_status === 'capture') {
      newStatus = fraud_status === 'accept' ? 'success' : 'failed'
    } else if (transaction_status === 'settlement') {
      newStatus = 'success'
    } else if (['deny', 'cancel'].includes(transaction_status)) {
      newStatus = 'failed'
    } else if (transaction_status === 'expire') {
      newStatus = 'expired'
    }

    // Update transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .update({
        status: newStatus,
        midtrans_transaction_id: transaction_id,
        payment_type: payment_type,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order_id)
      .select()
      .single()

    // If payment successful, add tokens to user
    if (newStatus === 'success' && transaction) {
      await supabase.rpc('add_tokens', {
        p_user_id: transaction.user_id,
        p_amount: transaction.tokens_purchased,
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

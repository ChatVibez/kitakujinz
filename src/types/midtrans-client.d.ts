declare module 'midtrans-client' {
  interface Config {
    isProduction: boolean
    serverKey: string
    clientKey: string
  }

  interface TransactionDetails {
    order_id: string
    gross_amount: number
  }

  interface ItemDetail {
    id: string
    price: number
    quantity: number
    name: string
  }

  interface CustomerDetails {
    email?: string
    first_name?: string
    last_name?: string
    phone?: string
  }

  interface TransactionParams {
    transaction_details: TransactionDetails
    item_details?: ItemDetail[]
    customer_details?: CustomerDetails
  }

  interface TransactionResponse {
    token: string
    redirect_url: string
  }

  class Snap {
    constructor(config: Config)
    createTransaction(params: TransactionParams): Promise<TransactionResponse>
  }

  class CoreApi {
    constructor(config: Config)
    transaction: {
      status(orderId: string): Promise<Record<string, unknown>>
    }
  }

  export default { Snap, CoreApi }
}

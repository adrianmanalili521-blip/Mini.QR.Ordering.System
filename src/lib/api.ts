// Use localhost for local development, or update to your server URL
export const API_BASE_URL = 'http://localhost:3001'

export interface ProductApiModel {
  id: number
  title: string
  name: string
  description: string
  price: number
  imageKey: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface OrderRecord {
  id: number
  created_at: string
  items: OrderItem[]
  payment_method: string
  total: number
  status: string
}

export async function fetchOrders(): Promise<OrderRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/orders`)
  if (!res.ok) {
    throw new Error('Failed to fetch orders')
  }
  const body = await res.json()
  
  // Parse items JSON string if it exists
  if (body.orders) {
    return body.orders.map((order: any) => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    }))
  }
  
  return []
}

export async function createOrder(
  items: OrderItem[],
  paymentMethod: string,
  total: number
): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items,
      paymentMethod,
      total,
    }),
  })
  
  if (!res.ok) {
    throw new Error('Failed to create order')
  }
  
  const body = await res.json()
  return body.orderId
}

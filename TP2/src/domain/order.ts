export type Size = "S" | "M" | "L"
export type OrderStatus = "created" | "preparing" | "delivered" | "canceled"

export interface OrderItem {
  size: Size
  toppings: string[]
}

export interface Order {
  id: string
  items: OrderItem[]
  address: string
  status: OrderStatus
  price: number
  createdAt: Date
}

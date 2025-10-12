import { OrderItem } from "./order"

const sizeBase: Record<string, number> = { S: 8, M: 10, L: 12 }
const toppingPrice = 1.5

export function computeOrderPrice(items: OrderItem[]): number {
  return items.reduce((acc, it) => {
    const base = sizeBase[it.size] ?? 0
    const extras = (it.toppings?.length ?? 0) * toppingPrice
    return acc + base + extras
  }, 0)
}

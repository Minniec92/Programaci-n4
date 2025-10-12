import { randomUUID } from "node:crypto"
import { Order, OrderItem } from "../domain/order"
import { OrderRepo } from "../repo/orderRepo"
import { computeOrderPrice } from "../domain/pricing"

export class OrderService {
  constructor(private repo: OrderRepo) {}

  async createOrder(address: string, items: OrderItem[]) {
    if (!items || items.length === 0) {
      const e: any = new Error("items empty")
      e.status = 422
      throw e
    }
    const price = computeOrderPrice(items)
    const order: Order = {
      id: randomUUID(),
      address,
      items,
      price,
      status: "created",
      createdAt: new Date()
    }
    await this.repo.create(order)
    return order
  }

  async getOrder(id: string) {
    const o = await this.repo.getById(id)
    if (!o) {
      const e: any = new Error("not found")
      e.status = 404
      throw e
    }
    return o
  }

  async cancelOrder(id: string) {
    const o = await this.getOrder(id)
    if (o.status === "delivered") {
      const e: any = new Error("cannot cancel delivered")
      e.status = 409
      throw e
    }
    await this.repo.updateStatus(id, "canceled")
    return { ...o, status: "canceled" }
  }

  async listOrders(status?: "created"|"preparing"|"delivered"|"canceled") {
    return this.repo.listByStatus(status)
  }
}

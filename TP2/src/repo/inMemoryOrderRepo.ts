import { Order, OrderStatus } from "../domain/order"
import { OrderRepo } from "./orderRepo"

export class InMemoryOrderRepo implements OrderRepo {
  private data = new Map<string, Order>()

  async create(o: Order) {
    this.data.set(o.id, o)
  }

  async getById(id: string) {
    return this.data.get(id) ?? null
  }

  async updateStatus(id: string, status: OrderStatus) {
    const o = this.data.get(id)
    if (!o) return
    this.data.set(id, { ...o, status })
  }

  async listByStatus(status?: OrderStatus) {
    const all = [...this.data.values()]
    return status ? all.filter(o => o.status === status) : all
  }
}

import { Order, OrderStatus } from "../domain/order"

export interface OrderRepo {
  create(o: Order): Promise<void>
  getById(id: string): Promise<Order | null>
  updateStatus(id: string, status: OrderStatus): Promise<void>
  listByStatus(status?: OrderStatus): Promise<Order[]>
}

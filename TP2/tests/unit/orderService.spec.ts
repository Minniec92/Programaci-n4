import { describe, it, expect } from "vitest"
import { OrderService } from "../../src/services/orderService"
import { InMemoryOrderRepo } from "../../src/repo/inMemoryOrderRepo"

describe("OrderService", () => {
  it("rechaza items vacios con 422", async () => {
    const svc = new OrderService(new InMemoryOrderRepo())
    await expect(svc.createOrder("Direccion valida 1234", [])).rejects.toMatchObject({ status: 422 })
  })

  it("crea pedido y calcula precio", async () => {
    const svc = new OrderService(new InMemoryOrderRepo())
    const o = await svc.createOrder("Direccion valida 1234", [{ size: "M", toppings: ["queso"] }])
    expect(o.id).toBeDefined()
    expect(o.price).toBeGreaterThan(0)
    expect(o.status).toBe("created")
  })

  it("no permite cancelar delivered con 409", async () => {
    const repo = new InMemoryOrderRepo()
    const svc = new OrderService(repo)
    const o = await svc.createOrder("Direccion valida 1234", [{ size: "S", toppings: [] }])
    await repo.updateStatus(o.id, "delivered")
    await expect(svc.cancelOrder(o.id)).rejects.toMatchObject({ status: 409 })
  })
})

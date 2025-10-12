import { Router } from "express"
import { OrderService } from "../../services/orderService"
import { createOrderSchema, statusQuerySchema } from "./validation"

export function ordersRouter(service: OrderService) {
  const router = Router()

  router.post("/orders", async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.flatten() })
    }
    try {
      const order = await service.createOrder(parsed.data.address, parsed.data.items)
      res.status(201).json(order)
    } catch (e: any) {
      res.status(e.status ?? 400).json({ error: e.message })
    }
  })

  router.get("/orders/:id", async (req, res) => {
    try {
      const order = await service.getOrder(req.params.id)
      res.json(order)
    } catch (e: any) {
      res.status(e.status ?? 404).json({ error: e.message })
    }
  })

  router.post("/orders/:id/cancel", async (req, res) => {
    try {
      const order = await service.cancelOrder(req.params.id)
      res.json(order)
    } catch (e: any) {
      res.status(e.status ?? 400).json({ error: e.message })
    }
  })

  router.get("/orders", async (req, res) => {
    const parsed = statusQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      return res.status(422).json({ error: parsed.error.flatten() })
    }
    const list = await service.listOrders(parsed.data.status)
    res.json(list)
  })

  return router
}

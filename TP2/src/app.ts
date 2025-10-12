import express from "express"
import { InMemoryOrderRepo } from "./repo/inMemoryOrderRepo"
import { OrderService } from "./services/orderService"
import { ordersRouter } from "./http/routes/orders"

export function makeApp() {
  const app = express()
  app.use(express.json())

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "tp2-api" })
  })

  const repo = new InMemoryOrderRepo()
  const svc = new OrderService(repo)
  app.use(ordersRouter(svc))

  app.get("/", (_req, res) => {
    res.send("🚀 API funcionando correctamente")
  })

  app.use((_req, res) => res.status(404).json({ error: "not found" }))

  return app
}

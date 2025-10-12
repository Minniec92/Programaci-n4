import request from "supertest"
import { describe, it, expect } from "vitest"
import { makeApp } from "../../src/app"

describe("Orders HTTP", () => {
  const app = makeApp()

  it("POST /orders 201", async () => {
    const res = await request(app).post("/orders").send({
      address: "Calle Falsa 1234",
      items: [{ size: "L", toppings: ["pepperoni","queso"] }]
    })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
  })

  it("GET /orders/:id y cancel", async () => {
    const crt = await request(app).post("/orders").send({
      address: "Otra direccion valida",
      items: [{ size: "M", toppings: [] }]
    })
    const id = crt.body.id
    const get = await request(app).get(`/orders/${id}`)
    expect(get.status).toBe(200)
    expect(get.body.id).toBe(id)
    const cancel = await request(app).post(`/orders/${id}/cancel`)
    expect(cancel.status).toBe(200)
    expect(cancel.body.status).toBe("canceled")
  })

  it("GET /orders filtra por status", async () => {
    const res = await request(app).get("/orders").query({ status: "created" })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("422 cuando body invalido", async () => {
    const res = await request(app).post("/orders").send({
      address: "corta",
      items: []
    })
    expect(res.status).toBe(422)
  })
})

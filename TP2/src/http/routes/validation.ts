import { z } from "zod"

export const sizeSchema = z.enum(["S","M","L"])
export const itemSchema = z.object({
  size: sizeSchema,
  toppings: z.array(z.string()).max(5)
})
export const createOrderSchema = z.object({
  address: z.string().min(10),
  items: z.array(itemSchema).min(1)
})
export const statusQuerySchema = z.object({
  status: z.enum(["created","preparing","delivered","canceled"]).optional()
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

import { z } from 'zod'

export const ItemPedidoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  precio: z.number().nonnegative(),
  cantidad: z.number().int().positive(),
})

export const PedidoSchema = z.object({
  items: z.array(ItemPedidoSchema).min(1),
})

export const RespuestaPedidoSchema = z.object({
  idPedido: z.string(),
  total: z.number().nonnegative(),
})

export type ItemPedido = z.infer<typeof ItemPedidoSchema>
export type Pedido = z.infer<typeof PedidoSchema>
export type RespuestaPedido = z.infer<typeof RespuestaPedidoSchema>

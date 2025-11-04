import { http, HttpResponse } from 'msw'
import { z } from 'zod'

const productos = [
  { id: 'c1', nombre: 'Café Americano', precio: 1500 },
  { id: 'c2', nombre: 'Frapuccino', precio: 2500 },
  { id: 'c3', nombre: 'Muffin', precio: 500 },
] as const

const ItemPedidoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  precio: z.number().positive(),
  cantidad: z.number().int().positive(),
})

const PedidoSchema = z.object({
  items: z.array(ItemPedidoSchema).min(1),
})

export const handlers = [
  http.get('/api/menu', () => {
    return HttpResponse.json(productos)
  }),

  http.post('/api/pedidos', async ({ request }) => {
    const json = await request.json()
    const parsed = PedidoSchema.safeParse(json)

    if (!parsed.success) {
      return HttpResponse.json(
        { mensaje: 'Pedido inválido', errores: parsed.error.issues },
        { status: 400 }
      )
    }

    const total = parsed.data.items.reduce(
      (acc, it) => acc + it.precio * it.cantidad,
      0
    )

    return HttpResponse.json(
      { idPedido: 'PED-12345', total },
      { status: 201 }
    )
  }),
]

import { z } from 'zod'

export const ProductoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  precio: z.number().nonnegative(),
})

export type Producto = z.infer<typeof ProductoSchema>

// Para listas de productos del menú
export const ListaProductosSchema = z.array(ProductoSchema)

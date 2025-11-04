import { ListaProductosSchema, Producto } from '../esquemas/producto'
import { Pedido, RespuestaPedidoSchema, RespuestaPedido } from '../esquemas/pedido'

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch('/api/productos')
  if (!respuesta.ok) throw new Error('Error al obtener los productos')
  const datos = await respuesta.json()
  return ListaProductosSchema.parse(datos)
}


export async function enviarPedido(pedido: Pedido): Promise<RespuestaPedido> {
  const respuesta = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  })

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}))
    throw new Error(error?.mensaje ?? 'Error al enviar el pedido')
  }

  const datos = await respuesta.json()
  return RespuestaPedidoSchema.parse(datos)
}

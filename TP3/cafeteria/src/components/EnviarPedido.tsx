import { useState } from 'react'
import { usePedido } from '../context/PedidoContexto'

export default function EnviarPedido() {
  const { items, vaciar, total } = usePedido()
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  const manejarClick = async () => {
    if (items.length === 0) return
    setEstado('enviando')
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            nombre: i.nombre,
            precio: i.precio,
            cantidad: i.cantidad,
          })),
        }),
      })
      if (!res.ok) {
        setEstado('error')
        setMensaje('Error al enviar el pedido')
        return
      }
      setEstado('ok')
      setMensaje('Pedido confirmado✅')
      vaciar()
    } catch {
      setEstado('error')
      setMensaje('Error al enviar el pedido')
    }
  }

  return (
    <div>
      <button
        onClick={manejarClick}
        disabled={items.length === 0 || estado === 'enviando'}
      >
        {estado === 'enviando' ? 'Enviando...' : 'Enviar pedido'}
      </button>
      {estado !== 'idle' && <p>{mensaje}</p>}
      <p>Total actual: ${total}</p>
    </div>
  )
}

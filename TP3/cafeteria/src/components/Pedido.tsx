import { usePedido } from '../context/PedidoContexto'

export default function Pedido() {
  const { items, eliminar, total } = usePedido()

  return (
    <section aria-labelledby="pedido-heading">
      <h2 id="pedido-heading">Pedido</h2>
      {items.length === 0 ? (
        <p>No hay ítems en el pedido.</p>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              {it.nombre} x {it.cantidad} = ${it.precio * it.cantidad}{' '}
              <button onClick={() => eliminar(it.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
    </section>
  )
}

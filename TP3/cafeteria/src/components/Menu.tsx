import { useEffect, useState } from 'react'
import { ListaProductosSchema } from '../esquemas/producto'
import { usePedido } from '../context/PedidoContexto'

type Producto = {
  id: string
  nombre: string
  precio: number
}

export default function Menu() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const { agregar } = usePedido()

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => {
        if (!res.ok) throw new Error('Error')
        return res.json()
      })
      .then((data) => {
        const parsed = ListaProductosSchema.parse(data)
        setProductos(parsed as unknown as Producto[])
      })
      .catch(() => {
        setError('Error al cargar menú')
      })
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p role="status">Cargando menú…</p>
  if (error) return <p role="alert">Error al cargar menú</p>
  if (productos.length === 0) return <p>No hay productos disponibles</p>

  return (
    <section aria-labelledby="menu-heading" style={{ width: '100%', marginBottom: '2rem' }}>
      <h2
        id="menu-heading"
        style={{
          marginBottom: '1rem',
          display: 'inline-block',
          borderBottom: '2px solid #eee',
          paddingBottom: '4px'
        }}
      >
        Menú
      </h2>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center'
        }}
      >
        {productos.map((p) => (
          <li
            key={p.id}
            style={{
              backgroundColor: '#f7f7f7',
              padding: '12px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '260px'
            }}
          >
            <img
              src={
                p.nombre.toLowerCase().includes('café')
                  ? '/img/Cafe.png'
                  : p.nombre.toLowerCase().includes('frapu')
                  ? '/img/Frapuccino.png'
                  : '/img/Muffin.png'
              }
              alt={p.nombre}
              style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>{p.nombre}</div>
              <div>${p.precio}</div>
            </div>
            <button
              onClick={() => agregar(p)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer'
              }}
            >
              Agregar
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

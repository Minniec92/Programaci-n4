import React, { createContext, useContext, useReducer, useMemo } from 'react'

type ItemPedido = {
  id: string
  nombre: string
  precio: number
  cantidad: number
}

type EstadoPedido = {
  items: ItemPedido[]
}

type Accion =
  | { type: 'AGREGAR'; payload: { id: string; nombre: string; precio: number } }
  | { type: 'ELIMINAR'; payload: { id: string } }
  | { type: 'VACIAR' }

const inicial: EstadoPedido = { items: [] }

function reducer(state: EstadoPedido, action: Accion): EstadoPedido {
  switch (action.type) {
    case 'AGREGAR': {
      const existe = state.items.find((i) => i.id === action.payload.id)
      if (existe) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, cantidad: i.cantidad + 1 } : i
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            id: action.payload.id,
            nombre: action.payload.nombre,
            precio: action.payload.precio,
            cantidad: 1,
          },
        ],
      }
    }
    case 'ELIMINAR':
      return { items: state.items.filter((i) => i.id !== action.payload.id) }
    case 'VACIAR':
      return { items: [] }
    default:
      return state
  }
}

const PedidoContexto = createContext<
  | (EstadoPedido & {
      agregar: (p: { id: string; nombre: string; precio: number }) => void
      eliminar: (id: string) => void
      vaciar: () => void
      total: number
    })
  | undefined
>(undefined)

export const ProveedorPedido: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, inicial)

  const valor = useMemo(() => {
    const total = state.items.reduce((acc, it) => acc + it.precio * it.cantidad, 0)
    return {
      ...state,
      agregar: (p: { id: string; nombre: string; precio: number }) =>
        dispatch({ type: 'AGREGAR', payload: p }),
      eliminar: (id: string) => dispatch({ type: 'ELIMINAR', payload: { id } }),
      vaciar: () => dispatch({ type: 'VACIAR' }),
      total,
    }
  }, [state])

  return <PedidoContexto.Provider value={valor}>{children}</PedidoContexto.Provider>
}

export function usePedido() {
  const ctx = useContext(PedidoContexto)
  if (!ctx) throw new Error('usePedido debe usarse dentro de ProveedorPedido')
  return ctx
}

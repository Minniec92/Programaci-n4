import { render, screen } from '@testing-library/react'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import App from '../App'

describe('HU6 - Menú vacío', () => {
  it('muestra mensaje cuando no hay productos', async () => {
    server.use(
      http.get('/api/menu', () => {
        return HttpResponse.json([])
      })
    )

    render(<App />)

    expect(await screen.findByText(/no hay productos disponibles/i)).toBeInTheDocument()
  })
})

describe('HU6 - Error en el menú', () => {
  it('muestra mensaje de error cuando la API falla', async () => {
    server.use(
      http.get('/api/menu', () => {
        return HttpResponse.json({ message: 'error' }, { status: 500 })
      })
    )

    render(<App />)

    expect(await screen.findByText(/error al cargar menú/i)).toBeInTheDocument()
  })
})

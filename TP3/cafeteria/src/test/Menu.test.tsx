import { render, screen } from '@testing-library/react'
import App from '../App'

describe('HU1 - Menú', () => {
  it('muestra productos del menú provenientes de la API', async () => {
    render(<App />)

    expect(await screen.findByText(/café americano/i)).toBeInTheDocument()
    expect(await screen.findByText(/frapuccino/i)).toBeInTheDocument()
    expect(await screen.findByText(/muffin/i)).toBeInTheDocument()
  })
})

describe('HU2 - Agregar ítem al pedido', () => {
  it('agrega un producto al hacer click en el primer botón Agregar', async () => {
    render(<App />)

    const botones = await screen.findAllByRole('button', { name: /agregar/i })
    await (await import('@testing-library/user-event')).default.click(botones[0])

    expect(await screen.findByText(/total: \$1500/i)).toBeInTheDocument()
  })
})

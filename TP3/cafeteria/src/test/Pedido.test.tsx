import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('HU3 - Calcular total', () => {
  it('actualiza el total cuando se agregan productos', async () => {
    render(<App />)

    const botones = await screen.findAllByRole('button', { name: /agregar/i })
    await userEvent.click(botones[0])
    await userEvent.click(botones[0])

    expect(await screen.findByText(/total: \$3000/i)).toBeInTheDocument()
  })
})

describe('HU4 - Eliminar ítem', () => {
  it('elimina solo el ítem seleccionado', async () => {
    render(<App />)

    const botones = await screen.findAllByRole('button', { name: /agregar/i })
    await userEvent.click(botones[0])

    const botonEliminar = await screen.findByRole('button', { name: /eliminar/i })
    await userEvent.click(botonEliminar)

    expect(await screen.findByText('No hay ítems en el pedido.')).toBeInTheDocument()
    expect(await screen.findByText(/total: \$0/i)).toBeInTheDocument()
  })
})

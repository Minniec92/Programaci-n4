import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('HU5 - Enviar pedido', () => {
  it('envía el pedido y limpia el estado', async () => {
    render(<App />)

    const botones = await screen.findAllByRole('button', { name: /agregar/i })
    await userEvent.click(botones[0])

    const botonEnviar = await screen.findByRole('button', { name: /enviar pedido/i })

    await waitFor(() => {
      expect(botonEnviar).toBeEnabled()
    })

    await userEvent.click(botonEnviar)

    expect(await screen.findByText(/pedido confirmado/i)).toBeInTheDocument()
    expect(await screen.findByText('No hay ítems en el pedido.')).toBeInTheDocument()
    expect(await screen.findByText(/total actual: \$0/i)).toBeInTheDocument()
  })
})

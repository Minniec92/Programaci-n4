import Menu from './components/Menu'
import Pedido from './components/Pedido'
import EnviarPedido from './components/EnviarPedido'
import { ProveedorPedido } from './context/PedidoContexto'

function App() {
  return (
    <ProveedorPedido>
      <div
        style={{
          width: '100%',            
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fffdf9',
        }}
      >
        <div
          style={{
            width: 'min(1000px, 90%)',
            backgroundColor: '#fffaf3',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <img
            src="/img/Cafeteria.png"
            alt="Logo Cafetería"
            style={{
              width: '130px',
              height: '130px',
              objectFit: 'contain',
              marginBottom: '10px',
            }}
          />
          <h1
            style={{
              fontSize: '3rem',
              color: '#4b2e05',
              marginBottom: '2rem',
            }}
          >
            Cafetería
          </h1>

          <Menu />
          <Pedido />
          <EnviarPedido />
        </div>
      </div>
    </ProveedorPedido>
  )
}

export default App

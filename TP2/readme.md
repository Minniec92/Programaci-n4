Integrantes del equipo : 
 - Castro,Jennifer.
 - Murinigo,Mariano Ivan.
 - Fontana,Paco.



## 📸 API en funcionamiento

A continuación se muestran las imagenes de la API corriendo correctamente en localhost y los tests ejecutados con éxito.

<p align="center">
  <img src="./CapturasAPIfuncionando /ApiFuncionandoCorrectamenteLocalhost.png" alt="API funcionando correctamente en localhost" width="600">
</p>

<p align="center">
  <img src="./CapturasAPIfuncionando /GET:orders.png" alt="GET /orders funcionando" width="600">
</p>

<p align="center">
  <img src="./CapturasAPIfuncionando /POST:orders.png" alt="POST /orders funcionando" width="600">
</p>

<p align="center">
  <img src="./CapturasAPIfuncionando /localhost:healthCorriendo.png" alt="Endpoint /health corriendo" width="600">
</p>

<p align="center">
  <img src="./CapturasAPIfuncionando /RequestHealthVscodeOk.png" alt="Request /health desde VSCode" width="600">
</p>

<p align="center">
  <img src="./CapturasAPIfuncionando /testsCorriendoOk.png" alt="Tests corriendo correctamente" width="600">
</p>


1) Modalidad y organización 
## Metodología: Rojo → Verde → Refactor

Aplicamos TDD en ciclos cortos. Cada ciclo tuvo:
1) Escribir un test que falle (rojo).
2) Implementar lo mínimo para pasarlo (verde).
3) Refactorizar manteniendo tests en verde.

### Ciclo 1: Validación de negocio (items vacíos → 422)
Rojo:
- Test: `tests/unit/orderService.spec.ts` → caso "rechaza items vacios con 422".
- Comando: `npm test`.
- Falla esperada: el servicio no valida items y no lanza error.

Verde:
- Implementación mínima en `src/services/orderService.ts`: chequeo de `items.length === 0` y error con `status = 422`.

Refactor:
- Ninguno funcional. Se mantuvo lógica en el servicio y firma estable.

### Ciclo 2: Cálculo de precio y creación de pedido
Rojo:
- Test: `tests/unit/orderService.spec.ts` → caso "crea pedido y calcula precio".
- Falla esperada: no existe cálculo de precio ni estructura completa de Order.

Verde:
- `src/domain/pricing.ts`: `computeOrderPrice`.
- `src/domain/order.ts`: tipos de dominio.
- `src/services/orderService.ts`: uso de `computeOrderPrice`, generación de `id`, `createdAt`, `status='created'`.

Refactor:
- Ninguno funcional. Se mantuvo separación dominio/servicio.

### Ciclo 3: Regla de negocio de cancelación (no cancelar delivered → 409)
Rojo:
- Test: `tests/unit/orderService.spec.ts` → caso "no permite cancelar delivered con 409".
- Falla esperada: se permite cancelar entregados.

Verde:
- `src/services/orderService.ts`: verificación `status === 'delivered'` y error con `status = 409`.

Refactor:
- Reutilización de `getOrder` dentro de `cancelOrder` para evitar duplicación.

### Ciclo 4: Contrato HTTP e integración
Rojo:
- Tests de integración en `tests/integration/orders.e2e.spec.ts` para `POST /orders`, `GET /orders/:id`, `POST /orders/:id/cancel`, `GET /orders?status=...`.
- Falla esperada: no hay rutas ni validación HTTP.

Verde:
- `src/http/validation.ts` con Zod.
- `src/http/routes/orders.ts` con endpoints y respuestas 201/200/404/409/422.
- `src/repo/inMemoryOrderRepo.ts` para almacenamiento en memoria.
- `src/app.ts` con `makeApp()` y montaje de rutas; `src/server.ts` solo arranca el servidor.

Refactor:
- Separación `app.ts`/`server.ts` para testear sin `listen`.
- Manejo de 404 genérico al final del pipeline.

### Cómo reproducir los ciclos
1) Ejecutar tests: `npm test` (rojo al inicio de cada historia).
2) Implementar lo mínimo en los archivos indicados (verde).
3) Confirmar que todos los tests permanecen en verde tras cambios (refactor seguro).

Resultado final:
- Tests unitarios y de integración en verde.
- Reglas de negocio validadas en servicio.
- Contrato HTTP validado con Supertest.
- Estructura en capas: domain → services → repo → http → app/server.

----------------------------------------------------------

API REST desarrollada con **Node.js**, **Express** y **TypeScript**, aplicando **Test Driven Development (TDD)** con **Vitest**.  
La API gestiona pedidos de pizzas: permite crearlos, listarlos, filtrarlos, obtener uno por ID y cancelarlos según reglas de negocio.

---

## 👥 User Stories abordadas

| ID | Historia de usuario | Endpoint | Resultado |
|----|----------------------|-----------|------------|
| US1 | Como usuario quiero crear un pedido con dirección e ítems válidos | POST `/orders` | Retorna 201 con pedido creado |
| US2 | Como usuario quiero obtener todos los pedidos creados | GET `/orders` | Retorna array con pedidos |
| US3 | Como usuario quiero filtrar pedidos por estado | GET `/orders?status=created` | Retorna solo pedidos filtrados |
| US4 | Como usuario quiero cancelar un pedido si no está entregado | POST `/orders/:id/cancel` | Cambia estado a `canceled` o devuelve 409 |
| US5 | Como usuario quiero obtener un pedido por ID | GET `/orders/:id` | Retorna pedido si existe o 404 |

---

## 🚀 Scripts disponibles

| Script | Descripción |
|---------|-------------|
| `npm run dev` | Levanta el servidor con tsx (modo desarrollo) |
| `npm run build` | Compila el proyecto a JavaScript (carpeta `dist/`) |
| `npm start` | Ejecuta el servidor compilado |
| `npm test` | Corre todos los tests unitarios e integración |
| `npm run coverage` | Genera reporte de cobertura (Vitest) |

---------------------------------------

──────────────────────────────
🧰 1️⃣ REQUISITOS
──────────────────────────────
Tener instalado:
- Node.js v18 o superior
- npm (incluido con Node) Instalar con npm install 
- VS Code (opcional: extensión “REST Client”, simula postman dentro del visual, 
  extension muy practica )


📦 2️⃣ INSTALACIÓN DE DEPENDENCIAS
──────────────────────────────
Dentro de la carpeta del proyecto, en nuestro caso fue : 
cd "~/Desktop/Programacion/TP2" 
npm install


🚀 3️⃣ LEVANTAR EL SERVIDOR
──────────────────────────────
npm run dev
# Si todo está correcto:
# Servidor corriendo en http://localhost:3000


🧠 4️⃣ PROBAR ENDPOINTS CON CURL
──────────────────────────────

# 1. Verificar salud del servicio
curl http://localhost:3000/health
# → {"ok":true,"service":"tp2-api"}

# 2. Crear un nuevo pedido
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{"address":"Av alem 2247","items":[{"size":"L","toppings":["extra cheddar"]}]}'
# → Devuelve 201 con id, address, items, price, status, createdAt

# 3. Listar todos los pedidos creados
curl http://localhost:3000/orders
# → Devuelve un array con los pedidos creados

# 4. Filtrar por estado
curl "http://localhost:3000/orders?status=created"
# → Devuelve solo los pedidos con status “created”

# 5. Obtener un pedido por ID
curl http://localhost:3000/orders/<ID_DEL_PEDIDO>
# → Devuelve ese pedido específico

# 6. Cancelar un pedido
curl -X POST http://localhost:3000/orders/<ID_DEL_PEDIDO>/cancel
# → Devuelve el mismo pedido con status “canceled”


🧪 5️⃣ EJECUTAR TESTS
──────────────────────────────
npm test
# Debe mostrar:
# ✓ OrderService › crea pedido y calcula precio
# ✓ Orders HTTP › POST /orders 201
# ...
# Test Files  2 passed
# Test Suites 2 passed
# Tests 7 passed




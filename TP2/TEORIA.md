1. Explique el ciclo Rojo → Verde Refactor y por qué es importante el tamaño de los pasos.

El ciclo Rojo → Verde → Refactor es la disciplina central del Desarrollo Guiado por Tests (TDD). En Rojo (Fail), se escribe un test que falla para una funcionalidad que aún no existe o un caso de uso no cubierto, definiendo así el comportamiento deseado. En el Verde (Pass), se escribe la cantidad mínima de código de producción necesaria para que el test pase, enfocándose únicamente en la funcionalidad. En Refactor (Clean), con todos los tests en verde actuando como una red de seguridad, se mejora la calidad, la legibilidad y la estructura del código sin alterar su comportamiento externo.
La importancia del tamaño de los pasos radica en que los ciclos deben ser pequeños e incrementales. Esto evita la complejidad y el sobrediseño (YAGNI), ya que solo se implementa el código que requiere el test fallido. Además, facilita la depuración: si un test pasa de Verde a Rojo, el error se localiza fácilmente en el pequeño fragmento de código que se acaba de introducir, permitiendo una corrección rápida y manteniendo un flujo de trabajo constante.

2. Diferencie tests unitarios, de integración y E2E en APIs.
Los tests unitarios prueban el componente más pequeño y aislado de la aplicación, generalmente una función o un servicio (regla de negocio). Para una API, esto incluye probar funciones que calculan el precio de un pedido o validan restricciones de cancelación. Estos tests aíslan las dependencias (como bases de datos o servicios externos) utilizando dobles de prueba.
Los tests de integración verifican que varios componentes funcionen correctamente juntos. En el contexto de Express y Supertest, prueban el contrato HTTP (la interacción entre el router, el middleware y el servicio). Estos tests simulan peticiones HTTP reales a un endpoint (POST /orders) y comprueban el estado HTTP, el body de la respuesta y los errores devueltos.Los tests End-to-End (E2E) simulan un flujo completo de usuario a través de toda la aplicación, incluyendo la interfaz de usuario (si existe), la API y la base de datos real, verificando el sistema desde la perspectiva del cliente. En una API headless, un test E2E podría simular múltiples peticiones encadenadas (ej: POST /orders, luego GET /order/:id, y finalmente POST /orders/:id/cancel) para verificar el flujo de trabajo completo.

3. ¿Qué es un doble de prueba? Defina mock, stub y spy y cuándo conviene cada uno.
Un doble de prueba es un objeto que sustituye a un componente dependiente (como una base de datos, un servicio externo o un módulo) durante la ejecución de un test. Su propósito es aislar la unidad de código que se está probando, controlando el comportamiento de las dependencias.
Stub: Es un doble que proporciona respuestas predefinidas a las llamadas realizadas durante el test. Es útil cuando el test necesita un dato de retorno específico de la dependencia (ej: "si la función de base de datos es llamada, devuelve este objeto 'Order'").
Mock: Es un doble que registra las interacciones y tiene expectativas preprogramadas sobre cómo será usado. Es útil para verificar el comportamiento, es decir, si el código que estamos probando llama a la dependencia de la manera correcta (ej: "espero que el servicio de email haya sido llamado exactamente una vez con estos parámetros").
Spy: Es una envoltura alrededor de una función o método real. El spy permite llamar a la implementación original mientras registra información sobre la llamada (cuántas veces se llamó, con qué argumentos, qué valor retornó). Es ideal cuando queremos usar la lógica real del componente pero verificar si fue invocado.

4. ¿Por qué es útil separar app de server? Muestre (en 8-10 líneas) un ejemplo mínimo con makeApp() y un test de integración con Supertest.
Es útil separar la configuración de la aplicación Express (app) de la ejecución del servidor (server.listen()) porque permite que la aplicación (app) sea exportada sin estar atada a un puerto, facilitando el testing. Supertest requiere la instancia de la aplicación Express para simular las peticiones HTTP sin necesidad de levantar un servidor real, lo que hace los tests más rápidos y menos propensos a errores de concurrencia de puertos.
Ejemplo: 
// app.ts
import express from 'express';

export function makeApp() {
  const app = express();
  app.use(express.json());
  app.get('/health', (req, res) => res.status(200).send('OK'));
  return app;
}

// server.ts
import { makeApp } from './app';
const app = makeApp();
const PORT = 3000;
// if (process.env.NODE_ENV !== 'test') { // Opcional
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }


// tests/integration/health.test.ts
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /health', () => {
  it('debería responder con 200 OK', async () => {
    const app = makeApp(); // Obtenemos la instancia de la app
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });
});

5. Zod: diferencia entre parse y safeParse. ¿Dónde usaría cada uno en una ruta Express y por qué?
La función z.schema.parse(data) intentará validar los datos y, si la validación falla, lanzará inmediatamente una excepción que debe ser capturada con un bloque try...catch. Si la validación tiene éxito, devuelve los datos tipados.
En contraste, z.schema.safeParse(data) nunca lanza una excepción. En su lugar, devuelve un objeto resultado con una propiedad success: boolean. Si la validación falla, el objeto contendrá success: false y un campo error con los detalles de la validación.
En una ruta Express, usaría safeParse en los bordes (controladores/rutas) para validar req.body, req.query o req.params. Esto permite capturar errores de validación de forma controlada y devolver respuestas HTTP específicas (ej: 422 Unprocessable Entity) sin que la aplicación crashee. Si el resultado es exitoso (success: true), se puede pasar el objeto validado y tipado al servicio. Usar parse sería menos idiomático, ya que requeriría un middleware de error más complejo para capturar la excepción.

6. Dé dos ejemplos de reglas de dominio que deben probarse con tests unitarios (no sólo validación de entrada).
Las reglas de dominio son la lógica de negocio central que debe residir en los servicios (no en las rutas) y deben ser probadas con unit tests.
Cálculo de Precios: La regla de que el precio total de un pedido se calcula sumando el costo base del size (S, M, L) más un costo adicional por cada topping, con una posible tarifa plana si se excede un número de ítems. Esto es una regla aritmética y lógica y no una simple validación de que el campo exista.
Restricción de Cancelación: La regla que establece que un pedido no puede ser cancelado si su status es igual a delivered. El 
unit test debe verificar que el método del servicio que maneja la cancelación lance un error específico (409 Conflict en la capa de integración) si se intenta cancelar un pedido con el estado prohibido.

7. ¿Qué malos olores suele haber en suites de tests? Dé 3 ejemplos (naming, duplicación, asserts débiles, mocks frágiles, etc.).
Los "malos olores" (Test Smells) son indicadores de que la suite de tests es difícil de mantener, frágil o poco efectiva:
Duplicación de Código de Setup: Ocurre cuando se repite la misma lógica para inicializar objetos o dependencias (ej: crear el mismo objeto Order o User) en múltiples tests. Se soluciona utilizando funciones helper o builders (Ver Pregunta 10) o la función beforeEach del framework de testing.
Mocks Frágiles (Fragile Mocks): Sucede cuando un test depende demasiado de la estructura interna del código de producción o de cómo se implementa un mock (ej: se mockea un método privado). Esto hace que el test se rompa con frecuencia ante cambios internos que no modifican el comportamiento externo, violando el principio de aislamiento.
Asserts Débiles (Weak Asserts): Es cuando un test pasa, pero no verifica lo suficiente para garantizar la funcionalidad. Por ejemplo, en un POST /orders, solo verificar que el statusCode sea 201, pero no verificar que el body de la respuesta contenga los datos del pedido recién creado o que el precio se haya calculado correctamente.

8. ¿Cómo trazará criterios de aceptación a tests? Incluya un mini ejemplo de tabla con 2 filas.
Los Criterios de Aceptación (CA) se trazan a los tests (Matriz de Casos) para garantizar que cada requisito del cliente tenga una o más pruebas que lo validen. Esto vincula la documentación del requisito con el código de prueba, demostrando que el feature está funcionalmente completo.
La matriz debe listar el requisito (CA) y el Test ID o nombre del test que lo verifica:
-------------------------------------------------------------------------------------------------------------------------------
ID/Caso| Precondición |    Descripción	        |    Input	                | Acción. 	  | Resultado esperado|Test Verificador
-------------------------------------------------------------------------------------------------------------------------------
CA1	   |Ninguna.	  | Creación exitosa de un  | body con items[] no vacío | POST /orders| 201 Created,      | order.api.test.
       |              |   pedido estándar.      |  y size válido.	        | 	          | pedido con precio | ts: should
       |              |                         |                           |             | calculado y       | create order 
       |              |                         |                           |             | status=pending.	  | successfully
--------------------------------------------------------------------------------------------------------------------------------
ERR1   | Ninguna.     |  Intento de crear un    | body con items[] ,        | POST/orders | 422 unprocessable | order.api.test.
       |              |  pedido sin items.      | array vacio               |             | entity por items[]| ts:should 
       |.             |                         |                           |             | vacio.            | return 422 


9. ¿Por qué no perseguir 100% de cobertura a toda costa? Mencione riesgos/limitaciones.
Perseguir el 100% de cobertura de código a toda costa no es recomendable porque la cobertura alta no garantiza la calidad ni la ausencia de bugs. La cobertura mide cuánto código se ejecuta durante los tests, no si los tests están probando el comportamiento correcto.
Riesgos/Limitaciones:
Falsos Positivos: Se pueden escribir tests superficiales (ej: un assert débil) que ejecuten una línea, pero no verifiquen la lógica de negocio adecuadamente. El código tiene cobertura del 100%, pero la funcionalidad real está rota.
Aumento de la Complejidad y Costo: Alcanzar el 100% a menudo requiere escribir tests complejos, frágiles y lentos para casos triviales (ej: getters/ setters simples, líneas de código que gestionan errores de red). Esto incrementa el tiempo de desarrollo y el costo de mantenimiento de la suite de tests, sin añadir valor significativo.
Foco en el Número, No en el Valor: La meta se convierte en complacer la métrica en lugar de escribir tests que realmente mitiguen el riesgo, descuidando probar los caminos críticos y las reglas de dominio complejas. Una cobertura ≥80% en archivos modificados (como se pide en este TP ) es un objetivo más equilibrado.

10. Defina y dé un ejemplo de helper/builder para tests.
Un Helper/Builder para Tests es un patrón de diseño que se utiliza para crear objetos complejos (como entidades de base de datos o bodies de solicitud) de manera consistente, legible y con datos predeterminados válidos para el entorno de pruebas. Su uso reduce la duplicación de código de setup y mejora la legibilidad de los tests, haciendo que sea obvio qué datos están siendo manipulados.

Ejemplo: Order Builder
En lugar de escribir un objeto JSON completo en cada test para el endpoint /orders:
// Sin Builder (Repetitivo y verboso)
const orderData = { size: 'M', toppings: ['cheese', 'pepperoni'], address: 'Calle Falsa 123' }; 
// ...

Se puede crear un Builder para que el test solo especifique las variaciones necesarias:
// order-builder.ts (Helper)
export function orderBuilder(overrides = {}) {
  return {
    size: 'L',
    toppings: ['cheese', 'onion'], // Datos por defecto válidos
    address: 'Av. Libertador 4000',
    items: [{ sku: 'pizza', quantity: 1 }],
    ...overrides // Permite sobrescribir cualquier campo
  };
}

// En el Test (Claro y Conciso)
it('debería crear un pedido con tamaño L', async () => {
  const data = orderBuilder(); // Usa L por defecto
  // ...
});

it('debería fallar si tiene muchos toppings', async () => {
  const data = orderBuilder({ toppings: ['a', 'b', 'c', 'd', 'e', 'f'] });
  // ...
});


# ☕ TP3 – Cafetería React + TDD

## 📋 Descripción general
Este trabajo práctico implementa una **aplicación de gestión de pedidos para una cafetería**, desarrollada con **React + TypeScript**, aplicando el enfoque **TDD (Desarrollo Guiado por Pruebas)** con **Vitest**, **React Testing Library** y **MSW** para el mockeo de la API.

## 👩‍💻 Integrantes del grupo

👩‍💻 **Castro, Jennifer**  
🧑‍💻 **Murinigo, Mariano Iván**

---

## ⚙️ Cómo ejecutar la aplicación

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Minniec92/Programaci-n4.git
cd Programaci-n4/TP3/cafeteria
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Correr la aplicación
```bash
npm run dev
```
La aplicación se ejecutará en  
👉 [http://localhost:5173]

### 4️⃣ Ejecutar los tests
```bash
npm test
```

---

## 🧩 Proceso de desarrollo TDD

El proyecto siguió el ciclo **Rojo 🔴 → Verde 🟢 → Refactor 🔁**, escribiendo los tests antes de implementar cada funcionalidad.

---

### 🔴 Etapa 1 — Tests iniciales con errores

Durante los primeros pasos del desarrollo, los tests fallaban al no estar implementadas todas las funciones requeridas ni el mock de la API.

| Tests iniciales (4 de 7 correctos) |
|:--:|
| ![4 de 7 OK](/img/4-7%20ok.png) |

---

### 🧰 Etapa 2 — Corrección progresiva de errores

Se implementaron los endpoints simulados con **MSW** y se validaron los esquemas con **Zod**, mejorando progresivamente hasta que todos los tests pasaron.

| Proceso de corrección |
|:--:|
| ![Corrigiendo errores 2-7 OK](/img/Corrigiendo%20errores%202-7%20ok.png) |
| ![Punto 1 OK](/img/Punto%201%20OK.png) |
| ![Punto 2 OK](/img/Punto%202%20OK.png) |

---

### 🟢 Etapa 3 — Todos los tests aprobados

Finalmente, todos los tests fueron superados correctamente, validando las funcionalidades de la app (menu, pedido, envío).

| Todos los tests OK ✅ |
|:--:|
| ![Tests OK](/img/tests%20ok.png) |

---

## 🌐 Aplicación funcionando

Tras la validación completa, se comprobó el funcionamiento total de la interfaz con los siguientes resultados:

### 🏁 Inicio de la página
| |
|:--:|
| ![Inicio de página](/img/Inicio%20de%20pagina.png) |

### 🍩 Ítems agregados al pedido
| |
|:--:|
| ![Ítems del menú agregados](/img/Items%20del%20menu%20agregados.png) |

### ✅ Pedido confirmado
| |
|:--:|
| ![Pedido confirmado](/img/Pedido%20confirmado.png) |

---

## 🧠 Conclusión

Este trabajo demuestra la aplicación práctica del enfoque **TDD en React**, integrando:

- **React + TypeScript**  
- **Zod** para validaciones de datos  
- **MSW** para simular endpoints de la API  
- **Vitest + React Testing Library** para pruebas unitarias  
- Arquitectura limpia con **Context API + Reducer**

💡 El resultado final es una aplicación completamente testeada, con diseño visual centrado y un flujo funcional de pedidos típico de una cafetería.

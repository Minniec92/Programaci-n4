Trabajo Práctico Nº4 – Corrección de Vulnerabilidades Web
INTEGRANTES: 
CASTRO, JENNIFER.
MURINIGO, MARIANO IVAN. 

Este trabajo consiste en identificar, explotar y corregir diversas vulnerabilidades intencionalmente agregadas en una aplicación web.El objetivo final es lograr que los 8 tests de seguridad pasen (8/8) ✔️.

1️⃣ Brute Force
Problema: Sin límite de intentos.
Corrección: Rate limit (5 intentos), delays, CAPTCHA, respuestas genéricas.
Aprendizaje: Sin límites, cualquier cuenta es vulnerable.

2️⃣ Command Injection
Problema: Entrada del usuario enviada directamente al sistema.
Corrección: Eliminar exec, validar input, whitelist estricta.
Aprendizaje: Nunca ejecutar comandos con datos del usuario.

3️⃣ CSRF
Problema: No había protección.
Corrección: csurf, validación Origin/Referer, SameSite=Strict.
Aprendizaje: CSRF se previene controlando origen + tokens.

4️⃣ Local File Inclusion (LFI)
Problema: Permitía leer archivos del servidor con ../.
Corrección: Whitelist, bloqueo de path traversal, sanitización.
Aprendizaje: Nunca permitir rutas dinámicas sin validar.

5️⃣ File Upload
Problema: Permitía cualquier archivo, incluso ejecutables.
Corrección: Whitelist extensiones, validar MIME real, renombrar, límite de tamaño, bloquear nombres peligrosos.
Aprendizaje: Subida de archivos = vector crítico si no se controla.

6️⃣ Insecure CAPTCHA
Problema: ID predecible, no expiraba, se podía reutilizar, mostraba debug, sin límite de intentos.
Corrección: ID aleatorio, expiración, uso único, remover debug, rate limit.
Aprendizaje: Un captcha inseguro puede ser saltado totalmente.

7️⃣ SQL Injection
Problema: Concatenación directa en la query.
Corrección: Prepared statements, validación estricta, sin comentarios SQL, no mostrar errores.
Aprendizaje: Nunca construir SQL con strings.

8️⃣ Blind SQL Injection
Problema: Permitía boolean-based, time-based y extracción carácter por carácter.
Corrección: Validación, parametrización, respuestas homogéneas, delay aleatorio, rate limit.
Aprendizaje: Blind SQL se detecta controlando tiempos y respuestas.

🧪 Ejecución de Tests
cd backend
npm install
npm run test:security ( Para todos los test juntos)
Para evaluar los test por separado utilizamos : 
npx jest test/security/01-brute-force.test.js --runInBand
npx jest test/security/02-command-injection.test.js --runInBand
npx jest test/security/03-csrf.test.js --runInBand
npx jest test/security/04-file-inclusion.test.js --runInBand
npx jest test/security/05-file-upload.test.js --runInBand
npx jest test/security/06-insecure-captcha.test.js --runInBand
npx jest test/security/07-sql-injection.test.js --runInBand
npx jest test/security/08-blind-sql-injection.test.js --runInBand

## 📸 Resultado Final

![8 tests pasados](/img/TODOSLOSTESTOK.png)


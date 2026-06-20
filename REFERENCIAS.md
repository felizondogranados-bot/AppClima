# 📚 REFERENCIAS — AppClima

> Grupo G9 · Desarrollo Web
> Mínimo 8 referencias académicas y técnicas

---

## 1. Documentación Oficial de Alpine.js

**Alpine.js Documentation**
- URL: https://alpinejs.dev/
- Descripción: Documentación oficial del framework Alpine.js. Cubre todos los conceptos fundamentales: instalación, directivas, magias, plugins y guías avanzadas.
- Uso en el proyecto: Referencia principal para `x-data`, `x-model`, `x-show`, `x-text`, `x-for`, `x-bind` y `Alpine.data()`.

---

## 2. Alpine.js Directives (Directivas)

**Alpine.js — Directives Reference**
- URL: https://alpinejs.dev/directives/data
- Descripción: Referencia completa de todas las directivas de Alpine.js. Incluye ejemplos de uso de `x-data`, `x-bind`, `x-on`, `x-text`, `x-html`, `x-model`, `x-modelable`, `x-for`, `x-transition`, `x-effect`, `x-ignore`, `x-ref`, `x-cloak`, `x-teleport`, `x-if`, `x-id`.
- Uso en el proyecto: Guía principal para implementar todas las directivas en `index.html`.

---

## 3. Alpine.js Reactivity (Reactividad)

**Alpine.js — Reactivity**
- URL: https://alpinejs.dev/advanced/reactivity
- Descripción: Explica el sistema de reactividad interno de Alpine.js basado en Proxies de JavaScript. Cubre cómo `x-data` convierte un objeto en estado reactivo y cómo las directivas se suscriben automáticamente a los cambios.
- Uso en el proyecto: Base para entender por qué el DOM se actualiza automáticamente cuando cambian `weather`, `loading` o `history`.

---

## 4. Alpine.js Essentials — Tutorial

**Alpine.js — Start Here**
- URL: https://alpinejs.dev/start-here
- Descripción: Tutorial oficial introductorio de Alpine.js. Cubre los conceptos esenciales: estado, eventos, DOM binding y animaciones básicas con ejemplos paso a paso.
- Uso en el proyecto: Referencia inicial para el diseño del componente `weatherApp`.

---

## 5. Node.js Documentation

**Node.js Official Documentation v20**
- URL: https://nodejs.org/docs/latest/api/
- Descripción: Documentación oficial de Node.js. Cubre módulos nativos como `path`, `fs`, `http`, `process` y las APIs de `fetch` nativo desde v18.
- Uso en el proyecto: Referencia para `require()`, `process.env`, `path.join()` en `server.js` y `weatherController.js`.

---

## 6. Express.js Documentation

**Express.js — Official Documentation**
- URL: https://expressjs.com/en/4x/api.html
- Descripción: Documentación oficial de Express v4. Cubre `express()`, `app.use()`, `app.get()`, `Router`, `req.params`, `res.json()`, `res.status()`, middleware CORS y archivos estáticos.
- Uso en el proyecto: Referencia para toda la arquitectura del backend: `server.js`, `weatherRoutes.js` y `weatherController.js`.

---

## 7. OpenWeatherMap API Documentation

**OpenWeatherMap — Current Weather Data API**
- URL: https://openweathermap.org/current
- Descripción: Documentación del endpoint `GET /data/2.5/weather`. Explica los parámetros de la petición (`q`, `appid`, `units`, `lang`), el formato de la respuesta JSON y los códigos de estado HTTP. Incluye la lista completa de íconos disponibles.
- Uso en el proyecto: Referencia para el endpoint consumido en `weatherController.js` y para interpretar la respuesta en `app.js`.

---

## 8. MDN Web Docs — Fetch API

**MDN — Using the Fetch API**
- URL: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- Descripción: Documentación completa de la Fetch API del navegador. Explica el uso de `fetch()`, `Promise`, `async/await`, manejo de errores con `try/catch` y la diferencia entre errores de red y errores HTTP.
- Uso en el proyecto: Referencia para `weatherService.js` (fetch del frontend al backend) y `weatherController.js` (fetch del backend a OWM).

---

## 9. MDN Web Docs — JavaScript Modules (ESM)

**MDN — JavaScript Modules**
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- Descripción: Guía completa de los módulos ECMAScript (ESM) en el navegador. Explica `import`, `export`, módulos con `type="module"`, rutas relativas y las restricciones del CORS con módulos.
- Uso en el proyecto: Referencia para la arquitectura modular del frontend: `weatherService.js` y `helpers.js` son módulos ESM importados en `app.js`.

---

## 10. MDN Web Docs — Web Storage API (localStorage)

**MDN — Window.localStorage**
- URL: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Descripción: Documentación del API de almacenamiento web. Explica `localStorage.setItem()`, `localStorage.getItem()`, `localStorage.removeItem()`, límites de almacenamiento y el formato JSON para guardar objetos.
- Uso en el proyecto: Referencia para la persistencia del historial de búsquedas implementada en `helpers.js` (`saveHistoryToStorage`, `loadHistoryFromStorage`).

---

## 11. MDN Web Docs — CSS Custom Properties (Variables)

**MDN — Using CSS Custom Properties**
- URL: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- Descripción: Guía sobre las propiedades personalizadas de CSS (variables CSS). Explica la sintaxis `:root { --nombre: valor; }`, el uso con `var()` y la herencia de valores.
- Uso en el proyecto: Referencia para el sistema de diseño en `styles.css` con variables como `--primary`, `--bg-card`, `--shadow-md`, etc.

---

## 12. Artículo Técnico — Alpine.js vs Vue vs React

**"Alpine.js vs React vs Vue: A Practical Comparison" — freeCodeCamp**
- URL: https://www.freecodecamp.org/news/alpinejs-vs-reactjs-vs-vue/
- Descripción: Artículo técnico que compara Alpine.js con React y Vue.js en términos de tamaño, curva de aprendizaje, reactividad, ecosistema y casos de uso. Incluye benchmarks y ejemplos de código comparativos.
- Uso en el proyecto: Referencia para la sección de ventajas y desventajas de Alpine.js en el README y para la exposición oral.

---

## Formato de Cita (APA 7)

**Alpine.js Documentation.** (2024). *Alpine.js — Official Documentation*. https://alpinejs.dev/

**Node.js Foundation.** (2024). *Node.js v20 Documentation*. https://nodejs.org/docs/latest/api/

**Express.js Contributors.** (2024). *Express 4.x API Reference*. https://expressjs.com/en/4x/api.html

**OpenWeatherMap.** (2024). *Current Weather Data — API Documentation*. https://openweathermap.org/current

**MDN Web Docs.** (2024). *Fetch API*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

**MDN Web Docs.** (2024). *JavaScript Modules (ESM)*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

**MDN Web Docs.** (2024). *Window.localStorage*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

**MDN Web Docs.** (2024). *CSS Custom Properties*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

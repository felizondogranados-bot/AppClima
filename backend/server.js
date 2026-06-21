// ============================================================
// TEMA: Node.js + Express — servidor principal de AppClima
// TEMA: CommonJS — importación de módulos con require()
// TEMA: Backend Web — middleware, CORS, rutas API y archivos estáticos
// ============================================================

// Carga las variables de entorno definidas en el archivo .env
// En producción, Render las toma desde la sección Environment.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Se crea la instancia principal de la aplicación Express
const app = express();

// Render asigna automáticamente el puerto mediante process.env.PORT.
// Para desarrollo local se usa el puerto 3000.
const PORT = process.env.PORT || 3000;

// ============================================================
// Middleware globales
// ============================================================

// Permite que el frontend pueda consumir la API sin problemas de CORS.
// En este proyecto se permite cualquier origen para facilitar pruebas y despliegue.
app.use(cors());

// Permite que Express pueda interpretar cuerpos JSON en las peticiones.
app.use(express.json());

// ============================================================
// Rutas API
// ============================================================

// Se importan las rutas relacionadas con el clima y sugerencias de ciudades.
// La arquitectura se mantiene separada para que el servidor no tenga toda la lógica mezclada.
const weatherRoutes = require('./routes/weatherRoutes');

// Todas las rutas del archivo weatherRoutes se agrupan bajo el prefijo /api.
// Ejemplos:
// GET /api/weather/Liberia
// GET /api/suggestions/Libe
app.use('/api', weatherRoutes);

// Ruta simple para verificar que el backend está funcionando correctamente.
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AppClima API funcionando correctamente',
    endpoints: {
      weather: '/api/weather/:city',
      suggestions: '/api/suggestions/:query'
    }
  });
});

// Si alguien entra a una ruta /api que no existe, se devuelve un 404 en formato JSON.
// Esto evita que Express intente responder con el index.html del frontend.
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Ruta API no encontrada',
    path: req.originalUrl
  });
});

// ============================================================
// Frontend estático
// ============================================================

// En desarrollo o producción, la carpeta frontend puede estar en distintas ubicaciones.
// Por eso se validan dos posibles rutas:
// 1. ../frontend  -> cuando backend y frontend están al mismo nivel.
// 2. ./frontend   -> cuando frontend está dentro de backend.
const frontendPaths = [
  path.join(__dirname, '..', 'frontend'),
  path.join(__dirname, 'frontend')
];

// Se selecciona la primera ruta que realmente exista.
const frontendPath = frontendPaths.find((folderPath) => fs.existsSync(folderPath));

if (frontendPath) {
  // Sirve los archivos estáticos del frontend: HTML, CSS, JS, imágenes, etc.
  app.use(express.static(frontendPath));

  // Ruta principal de la aplicación.
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  // Ruta comodín para una SPA.
  // Si el usuario refresca una ruta del frontend, se devuelve index.html.
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // Si no se encuentra el frontend, el backend igual debe seguir funcionando.
  // Esto ayuda mucho en Render porque permite confirmar que la API está viva.
  app.get('/', (req, res) => {
    res.send(`
      <h1>AppClima Backend funcionando</h1>
      <p>El backend está activo, pero no se encontró la carpeta frontend.</p>
      <p>Prueba la API en: <code>/api/status</code></p>
      <p>Endpoint clima: <code>/api/weather/:city</code></p>
    `);
  });

  app.get('*', (req, res) => {
    res.status(404).send('Ruta no encontrada');
  });
}

// ============================================================
// Manejador general de errores
// ============================================================

// Captura errores inesperados para evitar que el servidor responda de forma confusa.
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);

  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Ocurrió un problema procesando la solicitud'
  });
});

// ============================================================
// Inicio del servidor
// ============================================================

// Inicia el servidor en el puerto definido por Render o en el puerto local.
app.listen(PORT, () => {
  console.log(`\n🌤️  AppClima Backend corriendo en el puerto: ${PORT}`);
  console.log(`📡  Estado de la API: http://localhost:${PORT}/api/status`);
  console.log(`🌎  Clima por ciudad: http://localhost:${PORT}/api/weather/:city\n`);
});
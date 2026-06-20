// ============================================================
// TEMA: Node.js + Express — servidor principal
// TEMA: Módulos ESM / CommonJS — require/import de módulos
// TEMA: Rendimiento Web — middleware, CORS, archivos estáticos
// ============================================================

// TEMA: Node.js — carga de variables de entorno con dotenv
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// TEMA: JavaScript Moderno — uso de const
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
// TEMA: Express — uso de middleware CORS para permitir peticiones del frontend
app.use(cors());

// TEMA: Express — parseo automático de JSON en el body de las peticiones
app.use(express.json());

// TEMA: Express — servir el frontend como archivos estáticos
// Esto permite que el backend sirva el frontend en la misma URL
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── Rutas API ────────────────────────────────────────────────
// TEMA: Express — importar rutas desde módulo separado (arquitectura modular)
const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api', weatherRoutes);

// ── Ruta comodín ─────────────────────────────────────────────
// TEMA: Express — cualquier ruta no reconocida devuelve el index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Iniciar servidor ─────────────────────────────────────────
// TEMA: Node.js — escuchar peticiones en el puerto configurado
app.listen(PORT, () => {
  console.log(`\n🌤️  AppClima Backend corriendo en: http://localhost:${PORT}`);
  console.log(`📡  Endpoint disponible: GET http://localhost:${PORT}/api/weather/:city\n`);
});

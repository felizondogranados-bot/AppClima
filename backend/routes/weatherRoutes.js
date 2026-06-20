// ============================================================
// TEMA: Express — definición de rutas (Router modular)
// TEMA: Módulos — separación de responsabilidades
// ============================================================

const express = require('express');

// TEMA: JavaScript Moderno — destructuring de express
const router = express.Router();

// TEMA: Módulos — importar controlador desde archivo separado
const { getWeatherByCity } = require('../controllers/weatherController');

// TEMA: Express — ruta GET parametrizada
// Endpoint: GET /api/weather/:city
// El parámetro :city es la ciudad que el usuario busca
router.get('/weather/:city', getWeatherByCity);

module.exports = router;

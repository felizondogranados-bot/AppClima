// ============================================================
// TEMA: Express — definición de rutas (Router modular)
// TEMA: Módulos — separación de responsabilidades
// ============================================================

const express = require('express');

// TEMA: JavaScript Moderno — destructuring de express
const router = express.Router();

// TEMA: Módulos — importar controladores desde archivos separados
const { getWeatherByCity } = require('../controllers/weatherController');
const { getCitySuggestions } = require('../controllers/suggestionsController');

// TEMA: Express — ruta GET por nombre de ciudad
// Endpoint: GET /api/weather/:city
router.get('/weather/:city', getWeatherByCity);

// TEMA: Express — ruta de autocompletado de ciudades
// Endpoint: GET /api/suggestions/:query
router.get('/suggestions/:query', getCitySuggestions);

module.exports = router;


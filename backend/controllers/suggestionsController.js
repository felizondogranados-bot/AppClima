// ============================================================
// TEMA: Node.js + Express — controlador de sugerencias de ciudades
// TEMA: Asincronía — async/await y try/catch
// TEMA: Rendimiento Web — autocompletado con API de geocodificación
// ============================================================

// TEMA: Node.js — node-fetch para hacer peticiones HTTP desde el servidor
const fetch = require('node-fetch');

/**
 * TEMA: Asincronía — función async que retorna sugerencias de ciudades
 * Usa la API de geocodificación de Open-Meteo (gratuita, sin key)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getCitySuggestions = async (req, res) => {
  // TEMA: JavaScript Avanzado — destructuring del objeto req.params
  const { query } = req.params;

  // Evitar búsquedas muy cortas
  if (!query || query.trim().length < 2) {
    return res.json({ suggestions: [] });
  }

  // TEMA: JavaScript Avanzado — template literal para construir la URL
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=es&format=json`;

  // TEMA: Asincronía — try/catch para manejo de errores
  try {
    // TEMA: Asincronía — await para esperar la respuesta
    const response = await fetch(geoUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.json({ suggestions: [] });
    }

    // TEMA: JavaScript Avanzado — .map() para transformar el array de resultados
    const suggestions = data.results.map(place => ({
      name: place.name,
      country: place.country || '',
      countryCode: (place.country_code || '').toUpperCase(),
      region: place.admin1 || '',         // Estado/provincia
      latitude: place.latitude,
      longitude: place.longitude,
      // TEMA: JavaScript Avanzado — template literal para mostrar ubicación completa
      display: [place.name, place.admin1, place.country]
                .filter(Boolean)          // eliminar valores vacíos
                .join(', ')
    }));

    // TEMA: Express — respuesta exitosa en formato JSON
    res.json({ suggestions });

  } catch (error) {
    // TEMA: Asincronía — catch para errores de red
    console.error('Error en suggestionsController:', error.message);
    res.status(500).json({ suggestions: [] });
  }
};

// TEMA: Módulos — exportar la función para ser usada en las rutas
module.exports = { getCitySuggestions };

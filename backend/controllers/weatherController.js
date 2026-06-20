// ============================================================
// TEMA: Node.js + Express — controlador de clima
// TEMA: Asincronía — async/await y try/catch
// TEMA: JavaScript Avanzado — destructuring, template literals, arrow functions
// TEMA: Rendimiento Web — la API Key nunca se expone al cliente
//
// NOTA: Usando Open-Meteo (gratuita, sin key) mientras se activa
//       la key de OpenWeatherMap. El formato de respuesta es el mismo.
// ============================================================

// TEMA: Node.js — node-fetch para hacer peticiones HTTP desde el servidor
const fetch = require('node-fetch');

// ── Mapa de códigos WMO → descripción en español e icono ────
// Open-Meteo usa códigos WMO estándar en lugar de iconos propios
const WMO_CODES = {
  0:  { description: 'Cielo despejado',             icon: '01d' },
  1:  { description: 'Mayormente despejado',         icon: '01d' },
  2:  { description: 'Parcialmente nublado',         icon: '02d' },
  3:  { description: 'Nublado',                      icon: '04d' },
  45: { description: 'Neblina',                      icon: '50d' },
  48: { description: 'Neblina con escarcha',         icon: '50d' },
  51: { description: 'Llovizna ligera',              icon: '09d' },
  53: { description: 'Llovizna moderada',            icon: '09d' },
  55: { description: 'Llovizna intensa',             icon: '09d' },
  61: { description: 'Lluvia ligera',                icon: '10d' },
  63: { description: 'Lluvia moderada',              icon: '10d' },
  65: { description: 'Lluvia intensa',               icon: '10d' },
  71: { description: 'Nieve ligera',                 icon: '13d' },
  73: { description: 'Nieve moderada',               icon: '13d' },
  75: { description: 'Nieve intensa',                icon: '13d' },
  80: { description: 'Chubascos ligeros',            icon: '09d' },
  81: { description: 'Chubascos moderados',          icon: '09d' },
  82: { description: 'Chubascos intensos',           icon: '09d' },
  95: { description: 'Tormenta eléctrica',           icon: '11d' },
  96: { description: 'Tormenta con granizo',         icon: '11d' },
  99: { description: 'Tormenta con granizo fuerte',  icon: '11d' },
};

// ── Helper compartido ────────────────────────────────────────
/**
 * TEMA: Reutilización de código — función auxiliar que llama a Open-Meteo
 * dado un par de coordenadas. Usada tanto por getWeatherByCity como
 * por getWeatherByCoords para no duplicar lógica.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} cityName
 * @param {string} countryCode
 * @returns {Promise<Object>}
 */
async function fetchWeatherByCoords(latitude, longitude, cityName, countryCode) {
  // TEMA: JavaScript Avanzado — template literal para construir la URL
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code,visibility&timezone=auto&wind_speed_unit=ms`;

  // TEMA: Asincronía — await para esperar la respuesta del clima
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();

  if (!weatherResponse.ok || !weatherData.current) {
    throw new Error('Error al obtener datos del clima desde Open-Meteo.');
  }

  // TEMA: JavaScript Avanzado — destructuring de datos del clima
  const {
    temperature_2m: temp,
    apparent_temperature: feelsLike,
    relative_humidity_2m: humidity,
    surface_pressure: pressure,
    wind_speed_10m: windSpeed,
    weather_code: weatherCode,
    visibility: visibilityMeters,
    time
  } = weatherData.current;

  // Obtener descripción e icono desde el código WMO
  const wmo = WMO_CODES[weatherCode] || { description: 'Desconocido', icon: '01d' };

  // TEMA: JavaScript Avanzado — construir objeto de respuesta limpia
  return {
    city: cityName,
    country: (countryCode || '').toUpperCase(),
    temperature: Math.round(temp),
    feelsLike: Math.round(feelsLike),
    description: wmo.description,
    humidity,
    pressure: Math.round(pressure),
    windSpeed,
    visibility: visibilityMeters ? Math.round(visibilityMeters / 1000) : null,
    icon: wmo.icon,
    weatherId: weatherCode,
    timestamp: Math.floor(new Date(time).getTime() / 1000),
    timezone: 0
  };
}

// ── Controlador por nombre de ciudad ────────────────────────
/**
 * TEMA: Asincronía — función async que consulta Open-Meteo
 * Paso 1: geocodifica el nombre de ciudad → lat/lon
 * Paso 2: llama al helper con las coordenadas obtenidas
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getWeatherByCity = async (req, res) => {
  // TEMA: JavaScript Avanzado — destructuring del objeto req.params
  const { city } = req.params;

  // TEMA: Asincronía — try/catch para manejo de errores
  try {
    // ── Paso 1: Geocodificación (ciudad → coordenadas) ───────
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;

    // TEMA: Asincronía — await para esperar la respuesta
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    // Si no se encontró la ciudad, devolver error 404
    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Ciudad no encontrada. Verifica el nombre e intenta de nuevo.',
        code: '404'
      });
    }

    // TEMA: JavaScript Avanzado — destructuring del primer resultado
    const { name, latitude, longitude, country_code: countryCode } = geoData.results[0];

    // ── Paso 2: Clima a partir de coordenadas ────────────────
    const data = await fetchWeatherByCoords(latitude, longitude, name, countryCode);

    // TEMA: Express — respuesta exitosa en formato JSON
    res.status(200).json(data);

  } catch (error) {
    // TEMA: Asincronía — catch para errores de red o del servidor
    console.error('Error en getWeatherByCity:', error.message);
    res.status(500).json({
      error: true,
      message: 'Error al consultar el servicio meteorológico. Intente de nuevo.',
      code: 'SERVER_ERROR'
    });
  }
};

// ── Controlador por coordenadas ──────────────────────────────
/**
 * TEMA: Express — ruta alternativa para cuando ya tenemos lat/lon
 * (al seleccionar una sugerencia del autocompletado)
 * Evita hacer la geocodificación de nuevo.
 * Query params: ?lat=9.97&lon=-84.83&name=Tilarán&country=CR
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getWeatherByCoords = async (req, res) => {
  const { lat, lon, name, country } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      error: true,
      message: 'Se requieren los parámetros lat y lon.',
      code: 'MISSING_PARAMS'
    });
  }

  try {
    const data = await fetchWeatherByCoords(
      parseFloat(lat),
      parseFloat(lon),
      decodeURIComponent(name || 'Ciudad'),
      decodeURIComponent(country || '')
    );
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en getWeatherByCoords:', error.message);
    res.status(500).json({
      error: true,
      message: 'Error al consultar el servicio meteorológico. Intente de nuevo.',
      code: 'SERVER_ERROR'
    });
  }
};

// TEMA: Módulos — exportar las funciones para ser usadas en las rutas
module.exports = { getWeatherByCity, getWeatherByCoords };

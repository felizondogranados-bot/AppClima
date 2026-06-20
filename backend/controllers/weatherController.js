// ============================================================
// TEMA: Node.js + Express — controlador de clima
// TEMA: Asincronía — async/await y try/catch
// TEMA: JavaScript Avanzado — destructuring, template literals, arrow functions
// TEMA: Rendimiento Web — la API Key nunca se expone al cliente
// ============================================================

// TEMA: Node.js — node-fetch para hacer peticiones HTTP desde el servidor
const fetch = require('node-fetch');

// ── Controlador principal ────────────────────────────────────
/**
 * TEMA: Asincronía — función async que consulta OpenWeatherMap
 * TEMA: Express — recibe req (Request) y res (Response)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getWeatherByCity = async (req, res) => {
  // TEMA: JavaScript Avanzado — destructuring del objeto req.params
  const { city } = req.params;

  // TEMA: Node.js — variables de entorno para proteger la API Key
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  // Verificar que la API Key esté configurada
  if (!API_KEY || API_KEY === 'tu_api_key_aqui') {
    return res.status(500).json({
      error: true,
      message: 'La API Key de OpenWeatherMap no está configurada en el servidor.',
      code: 'API_KEY_MISSING'
    });
  }

  // TEMA: JavaScript Avanzado — template literal para construir la URL
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`;

  // TEMA: Asincronía — try/catch para manejo de errores
  try {
    // TEMA: Asincronía — await para esperar la respuesta de la API
    const response = await fetch(url);

    // TEMA: JavaScript Avanzado — destructuring de la respuesta
    const data = await response.json();

    // Manejar errores de la API (ciudad no encontrada, etc.)
    if (!response.ok) {
      // TEMA: Express — respuesta con código de error apropiado
      return res.status(response.status).json({
        error: true,
        message: data.message || 'Error al consultar el servicio meteorológico.',
        code: data.cod || response.status
      });
    }

    // TEMA: JavaScript Avanzado — destructuring de datos del clima
    const {
      name,
      sys: { country },
      main: { temp, feels_like, humidity, pressure },
      weather: [{ description, icon, id: weatherId }],
      wind: { speed },
      visibility,
      dt,
      timezone
    } = data;

    // TEMA: JavaScript Avanzado — construir objeto de respuesta limpia
    // Solo enviamos los datos necesarios al frontend
    const weatherData = {
      city: name,
      country,
      // TEMA: JavaScript Avanzado — spread operator implícito en el objeto
      temperature: Math.round(temp),
      feelsLike: Math.round(feels_like),
      description: description.charAt(0).toUpperCase() + description.slice(1),
      humidity,
      pressure,
      windSpeed: speed,
      visibility: visibility ? Math.round(visibility / 1000) : null,
      icon,
      weatherId,
      timestamp: dt,
      timezone
    };

    // TEMA: Express — respuesta exitosa en formato JSON
    res.status(200).json(weatherData);

  } catch (error) {
    // TEMA: Asincronía — catch para errores de red o del servidor
    console.error('Error en weatherController:', error.message);

    res.status(500).json({
      error: true,
      message: 'Error al consultar el servicio meteorológico. Intente de nuevo.',
      code: 'SERVER_ERROR'
    });
  }
};

// TEMA: Módulos — exportar la función para ser usada en las rutas
module.exports = { getWeatherByCity };

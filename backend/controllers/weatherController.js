// ============================================================
// TEMA: Node.js + Express — controlador de clima (OpenWeatherMap)
// TEMA: Asincronía — async/await y try/catch
// TEMA: JavaScript Avanzado — destructuring, template literals, arrow functions
// TEMA: Rendimiento Web — la API Key nunca se expone al cliente
// ============================================================

const fetch = require('node-fetch');

/**
 * TEMA: Asincronía — función async que consulta OpenWeatherMap por ciudad
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getWeatherByCity = async (req, res) => {
  const { city } = req.params;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Validar existencia de la API Key en el entorno
  if (!apiKey || apiKey === 'tu_api_key_aqui' || apiKey === 'MI_API_KEY') {
    return res.status(500).json({
      error: true,
      message: 'La API Key de OpenWeatherMap no está configurada o es inválida en el servidor.',
      code: 'API_KEY_MISSING'
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`;
    
    // TEMA: Asincronía — await para esperar la respuesta de la API externa
    const response = await fetch(url);
    const data = await response.json();

    // Manejo de errores específicos de OpenWeatherMap
    if (response.status === 404) {
      return res.status(404).json({
        error: true,
        message: `Ciudad "${city}" no encontrada. Verifica el nombre e intenta de nuevo.`,
        code: '404'
      });
    }

    if (response.status === 401) {
      return res.status(401).json({
        error: true,
        message: 'La API Key de OpenWeatherMap configurada en el servidor no es válida.',
        code: '401'
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: true,
        message: data.message || 'Error al obtener datos del clima desde el proveedor.',
        code: 'API_ERROR'
      });
    }

    // Convertir el código de país (ej. "CR") a su nombre completo en español (ej. "Costa Rica")
    const countryCode = data.sys && data.sys.country;
    let countryName = countryCode || '';
    if (countryCode) {
      try {
        // TEMA: JavaScript Avanzado — API de Internacionalización nativa (Intl.DisplayNames)
        const displayNames = new Intl.DisplayNames(['es'], { type: 'region' });
        countryName = displayNames.of(countryCode) || countryCode;
      } catch (e) {
        console.error('Error al traducir código de país:', e.message);
      }
    }

    // TEMA: JavaScript Avanzado — construir objeto de respuesta limpia con únicamente los 9 campos
    const weatherResponse = {
      city: data.name,
      country: countryName,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather && data.weather[0] ? data.weather[0].description : '',
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather && data.weather[0] ? data.weather[0].icon : '',
      lastUpdate: new Date().toLocaleString('es-CR')
    };

    return res.status(200).json(weatherResponse);

  } catch (error) {
    console.error('Error en getWeatherByCity:', error.message);
    return res.status(500).json({
      error: true,
      message: 'Sin conexión a internet o error de red al consultar el servicio meteorológico.',
      code: 'NETWORK_ERROR'
    });
  }
};

// TEMA: Módulos — exportar la función para ser usada en las rutas
module.exports = { getWeatherByCity };

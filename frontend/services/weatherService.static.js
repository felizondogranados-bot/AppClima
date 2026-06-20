// ============================================================
// TEMA: Módulos ESM — versión estática para GitHub Pages
// TEMA: Asincronía — fetch directo a Open-Meteo (sin backend)
// TEMA: JavaScript Avanzado — arrow functions, template literals
//
// Esta versión llama directamente a la API pública de Open-Meteo
// (sin key, CORS habilitado) para funcionar en GitHub Pages
// donde no hay servidor Node.js disponible.
// ============================================================

// ── Mapa de códigos WMO → descripción en español e icono ────
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

// ── Helper: obtener clima por coordenadas ────────────────────
async function fetchWeatherData(latitude, longitude, cityName, countryCode) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&wind_speed_unit=ms`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !data.current) {
    throw { status: 500, message: 'Error al obtener datos del clima.', code: 'WEATHER_ERROR' };
  }

  const {
    temperature_2m:        temp,
    apparent_temperature:  feelsLike,
    relative_humidity_2m:  humidity,
    wind_speed_10m:        windSpeed,
    weather_code:          weatherCode
  } = data.current;

  const wmo = WMO_CODES[weatherCode] || { description: 'Desconocido', icon: '01d' };

  // Convertir el código de país (ej. "CR") a su nombre completo en español (ej. "Costa Rica")
  let countryName = countryCode || '';
  if (countryCode) {
    try {
      const displayNames = new Intl.DisplayNames(['es'], { type: 'region' });
      countryName = displayNames.of(countryCode.toUpperCase()) || countryCode;
    } catch (e) {
      console.error('Error al traducir código de país:', e.message);
    }
  }

  return {
    city:        cityName,
    country:     countryName,
    temperature: Math.round(temp),
    feelsLike:   Math.round(feelsLike),
    description: wmo.description,
    humidity,
    windSpeed,
    icon:        wmo.icon,
    lastUpdate:  new Date().toLocaleString('es-CR')
  };
}

/**
 * TEMA: Asincronía — busca el clima por nombre de ciudad
 * Geocodifica el nombre y luego consulta Open-Meteo directamente
 * @param {string} city
 */
export const getWeather = async (city) => {
  try {
    // Paso 1: geocodificación
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw {
        status: 404,
        message: `Ciudad "${city}" no encontrada. Verifica el nombre e intenta de nuevo.`,
        code: '404'
      };
    }

    const { name, latitude, longitude, country_code } = geoData.results[0];

    // Paso 2: clima por coordenadas
    return await fetchWeatherData(latitude, longitude, name, country_code);

  } catch (error) {
    if (error instanceof TypeError) {
      throw { status: 0, message: 'Sin conexión a internet.', code: 'NETWORK_ERROR' };
    }
    throw error;
  }
};

/**
 * TEMA: Asincronía — obtiene sugerencias de ciudades para el autocompletado
 * @param {string} query
 */
export const getSuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=es&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map(place => ({
      name:        place.name,
      country:     place.country     || '',
      countryCode: (place.country_code || '').toUpperCase(),
      region:      place.admin1      || '',
      latitude:    place.latitude,
      longitude:   place.longitude,
      display:     [place.name, place.admin1, place.country]
                     .filter(Boolean)
                     .join(', ')
    }));
  } catch {
    return [];
  }
};

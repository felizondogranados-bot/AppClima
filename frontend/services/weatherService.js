// ============================================================
// TEMA: Módulos ESM — exportación de funciones de servicio
// TEMA: Asincronía — fetch, async/await, try/catch
// TEMA: JavaScript Avanzado — arrow functions, template literals
// ============================================================

// TEMA: JavaScript Moderno — URL base del backend
// En producción, esta URL apuntaría al servidor desplegado
const BASE_URL = window.location.origin;

/**
 * TEMA: Asincronía — función async que consulta el backend Express
 * TEMA: Módulos ESM — exportada para ser usada en otros módulos
 * @param {string} city - Nombre de la ciudad a consultar
 * @returns {Promise<Object>} Datos del clima
 */
export const getWeather = async (city) => {
  // TEMA: Asincronía — try/catch para manejo de errores de red
  try {
    // TEMA: Asincronía — await para esperar la respuesta
    // TEMA: JavaScript Avanzado — template literal para construir la URL
    const response = await fetch(`${BASE_URL}/api/weather/${encodeURIComponent(city)}`);

    // TEMA: JavaScript Moderno — await para parsear el JSON
    const data = await response.json();

    // Manejar errores de la API retornados por el backend
    if (!response.ok || data.error) {
      // TEMA: JavaScript Avanzado — throw con objeto de error enriquecido
      throw {
        status: response.status,
        message: data.message || 'Error desconocido al consultar el clima.',
        code: data.code || 'UNKNOWN_ERROR'
      };
    }

    return data;

  } catch (error) {
    // TEMA: Asincronía — re-lanzar el error para que lo maneje el componente Alpine
    // Distinguir entre error de red (TypeError) y error de la API
    if (error instanceof TypeError) {
      throw {
        status: 0,
        message: 'Sin conexión a internet. Verifica tu red e intenta de nuevo.',
        code: 'NETWORK_ERROR'
      };
    }
    throw error;
  }
};



/**
 * TEMA: Asincronía — función async que obtiene sugerencias de ciudades
 * TEMA: Módulos ESM — exportada para ser usada en app.js
 * @param {string} query - Texto parcial ingresado por el usuario
 * @returns {Promise<Array>} Lista de sugerencias
 */
export const getSuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await fetch(`${BASE_URL}/api/suggestions/${encodeURIComponent(query.trim())}`);
    const data = await response.json();
    return data.suggestions || [];
  } catch {
    // Silenciar errores — no interrumpen la experiencia del usuario
    return [];
  }
};

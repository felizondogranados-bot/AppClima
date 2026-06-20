// ============================================================
// TEMA: Módulos ESM — funciones utilitarias reutilizables
// TEMA: JavaScript Avanzado — arrow functions, destructuring, template literals
// TEMA: Rendimiento Web — funciones reutilizables para evitar código duplicado
// ============================================================

/**
 * TEMA: JavaScript Avanzado — arrow function
 * Formatea temperatura con símbolo de grado
 * @param {number} temp
 * @returns {string}
 */
export const formatTemp = (temp) => `${temp}°C`;

/**
 * Convierte velocidad de viento de m/s a km/h
 * @param {number} speed
 * @returns {string}
 */
export const formatWind = (speed) => `${Math.round(speed * 3.6)} km/h`;

/**
 * TEMA: JavaScript Avanzado — template literal
 * Genera la URL del ícono de OpenWeatherMap
 * @param {string} icon - Código del ícono OWM
 * @param {string} size - '2x' o '4x'
 * @returns {string}
 */
export const getIconUrl = (icon, size = '2x') =>
  `https://openweathermap.org/img/wn/${icon}@${size}.png`;

/**
 * TEMA: Rendimiento Web — función de persistencia en localStorage
 * Guarda el historial de ciudades en localStorage
 * @param {string[]} history - Array de ciudades
 */
export const saveHistoryToStorage = (history) => {
  localStorage.setItem('weatherHistory', JSON.stringify(history));
};

/**
 * Recupera el historial de ciudades desde localStorage
 * @returns {string[]}
 */
export const loadHistoryFromStorage = () => {
  try {
    const stored = localStorage.getItem('weatherHistory');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * TEMA: JavaScript Avanzado — spread operator, array methods
 * Agrega una ciudad al historial sin duplicados consecutivos (máx. 5)
 * @param {string[]} history - Historial actual
 * @param {string} city - Ciudad a agregar
 * @returns {string[]} Nuevo historial
 */
export const addToHistory = (history, city) => {
  // Evitar duplicados consecutivos
  if (history[0] === city) return history;

  // TEMA: JavaScript Avanzado — spread operator para crear nuevo array
  const updated = [city, ...history.filter(c => c !== city)];

  // Mantener máximo 5 registros
  return updated.slice(0, 5);
};

/**
 * TEMA: JavaScript Avanzado — mapeo de clima por icono
 * Determina el fondo degradado según el clima
 * @param {string} icon - Código del ícono del clima
 * @returns {string} Clase CSS para el fondo
 */
export const getWeatherClass = (icon) => {
  if (!icon) return 'bg-default';
  const prefix = icon.slice(0, 2);
  switch (prefix) {
    case '01':
      return 'bg-clear';
    case '02':
    case '03':
    case '04':
      return 'bg-clouds';
    case '09':
    case '10':
      return 'bg-rain';
    case '11':
      return 'bg-thunderstorm';
    case '13':
      return 'bg-snow';
    case '50':
      return 'bg-fog';
    default:
      return 'bg-default';
  }
};

/**
 * Formatea una fecha Unix timestamp a hora local
 * @param {number} timestamp - Unix timestamp
 * @param {number} timezone - Offset de zona horaria en segundos
 * @returns {string}
 */
export const formatTime = (timestamp, timezone) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
};

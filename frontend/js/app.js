// ============================================================
// TEMA: Alpine.js — componente principal con x-data
// TEMA: Módulos ESM — import de servicios y utilidades
// TEMA: Asincronía — async/await, try/catch
// TEMA: JavaScript Avanzado — arrow functions, destructuring, spread, template literals
// TEMA: Rendimiento Web — localStorage, evitar llamadas duplicadas
// TEMA: Eventos — manejados por Alpine.js (@click, @keyup.enter)
// ============================================================

// TEMA: Módulos ESM — importar funciones del servicio de clima
import { getWeather, getSuggestions, getWeatherByCoords } from '../services/weatherService.js';

// TEMA: Módulos ESM — importar funciones utilitarias
import {
  formatTemp,
  formatWind,
  getIconUrl,
  saveHistoryToStorage,
  loadHistoryFromStorage,
  addToHistory,
  getWeatherClass
} from '../utils/helpers.js';

/**
 * TEMA: Alpine.js — función que retorna el objeto x-data del componente
 * TEMA: JavaScript Avanzado — arrow function
 * Se registra globalmente para que Alpine.js pueda encontrarlo
 */
const weatherApp = () => ({
  // ── Estado del componente ──────────────────────────────────
  // TEMA: Alpine.js (x-data) — todas las propiedades reactivas del componente
  // TEMA: JavaScript Moderno — objetos y arrays

  /** Ciudad ingresada en el input de búsqueda (x-model) */
  searchQuery: '',

  /** Datos del clima actual (null = sin datos aún) */
  weather: null,

  /** Estado de carga: true mientras se consulta la API */
  loading: false,

  /** Mensaje de error a mostrar al usuario */
  errorMessage: '',

  /** Indica si hay un error activo */
  hasError: false,

  /** Historial de las últimas 5 ciudades consultadas */
  history: [],

  /** Ciudad por defecto al iniciar la aplicación */
  defaultCity: 'San Jose,CR',

  // ── Estado del autocompletado ──────────────────────────────
  /** Lista de sugerencias de ciudades */
  suggestions: [],

  /** Si el dropdown de sugerencias está visible */
  showSuggestions: false,

  /** Timer para debounce del autocompletado */
  _debounceTimer: null,

  // ── Propiedades computadas ─────────────────────────────────

  /** Obtiene la URL del ícono del clima actual */
  get iconUrl() {
    return this.weather ? getIconUrl(this.weather.icon, '4x') : '';
  },

  /** Clase CSS dinámica según el tipo de clima */
  get weatherClass() {
    return this.weather ? getWeatherClass(this.weather.weatherId) : 'bg-default';
  },

  /** Temperatura formateada */
  get tempFormatted() {
    return this.weather ? formatTemp(this.weather.temperature) : '';
  },

  /** Velocidad del viento formateada */
  get windFormatted() {
    return this.weather ? formatWind(this.weather.windSpeed) : '';
  },

  // ── Ciclo de vida ──────────────────────────────────────────

  /**
   * TEMA: Alpine.js — init() se ejecuta automáticamente al inicializar x-data
   * TEMA: Rendimiento Web — recuperar historial de localStorage al cargar
   */
  async init() {
    // TEMA: Rendimiento Web — cargar historial guardado en localStorage
    this.history = loadHistoryFromStorage();

    // TEMA: Alpine.js — ciudad por defecto al cargar la aplicación
    await this.fetchWeather(this.defaultCity);
  },

  // ── Métodos ────────────────────────────────────────────────

  /**
   * TEMA: Eventos — llamado desde @click del botón Buscar y @keyup.enter
   * TEMA: JavaScript Avanzado — arrow function implícita en objeto
   */
  async search() {
    // Limpiar espacios del input
    const city = this.searchQuery.trim();

    if (!city) return;

    await this.fetchWeather(city);
  },

  /**
   * TEMA: Asincronía — función principal async que consume el backend
   * TEMA: JavaScript Avanzado — destructuring, template literals
   * @param {string} city - Ciudad a consultar
   */
  async fetchWeather(city) {
    // Evitar llamada duplicada si ya está cargando
    if (this.loading) return;

    // TEMA: Alpine.js (x-show) — activar estado de carga
    this.loading = true;
    this.hasError = false;
    this.errorMessage = '';

    // TEMA: Asincronía — try/catch para manejo de errores
    try {
      // TEMA: Asincronía — await para esperar la respuesta del backend
      // TEMA: Módulos ESM — uso de getWeather importado del servicio
      const data = await getWeather(city);

      // TEMA: JavaScript Moderno — asignar datos al estado reactivo
      this.weather = data;

      // TEMA: JavaScript Avanzado — destructuring del objeto de clima
      const { city: cityName } = data;

      // TEMA: JavaScript Avanzado — spread operator en addToHistory
      // TEMA: Rendimiento Web — guardar en localStorage sin duplicados
      this.history = addToHistory(this.history, cityName);
      saveHistoryToStorage(this.history);

      // Limpiar el input después de una búsqueda exitosa
      this.searchQuery = '';

    } catch (error) {
      // TEMA: Asincronía — manejo de errores amigables
      this.hasError = true;

      // TEMA: JavaScript Avanzado — operador condicional para mensaje apropiado
      if (error.status === 404) {
        this.errorMessage = `Ciudad "${city}" no encontrada. Verifica el nombre e intenta de nuevo.`;
      } else if (error.code === 'NETWORK_ERROR') {
        this.errorMessage = 'Sin conexión a internet. Verifica tu red e intenta de nuevo.';
      } else if (error.code === 'API_KEY_MISSING') {
        this.errorMessage = 'El servidor no tiene configurada la API Key. Contacta al administrador.';
      } else {
        this.errorMessage = error.message || 'Error al consultar el servicio meteorológico.';
      }

    } finally {
      // TEMA: Alpine.js (x-show) — desactivar estado de carga siempre
      this.loading = false;
    }
  },

  /**
   * TEMA: Alpine.js — llamado desde x-for del historial con @click
   * Busca una ciudad del historial al hacer clic
   * @param {string} city
   */
  async searchFromHistory(city) {
    this.searchQuery = city;
    await this.fetchWeather(city);
  },

  // ── Autocompletado ─────────────────────────────────────────

  /**
   * TEMA: Rendimiento Web — debounce para no llamar la API en cada tecla
   * Se llama desde @input en el campo de búsqueda
   * Espera 300 ms después de que el usuario deja de escribir
   */
  onInput() {
    // TEMA: JavaScript Avanzado — limpiar el timer anterior
    clearTimeout(this._debounceTimer);

    const q = this.searchQuery.trim();

    if (q.length < 2) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    // TEMA: Asincronía — setTimeout como debounce (300 ms)
    this._debounceTimer = setTimeout(async () => {
      // TEMA: Módulos ESM — uso de getSuggestions importado
      this.suggestions = await getSuggestions(q);
      this.showSuggestions = this.suggestions.length > 0;
    }, 300);
  },

  /**
   * Selecciona una sugerencia del dropdown y busca el clima
   * TEMA: Rendimiento Web — usa coordenadas directamente,
   * evitando una segunda geocodificación innecesaria.
   * @param {{ name, countryCode, region, country, latitude, longitude, display }} s
   */
  async selectSuggestion(s) {
    // Mostrar el nombre limpio en el input
    this.searchQuery = s.display;
    this.closeSuggestions();

    if (this.loading) return;
    this.loading = true;
    this.hasError = false;
    this.errorMessage = '';

    try {
      // TEMA: Asincronía — llamada directa por coordenadas (sin geocodificación)
      // TEMA: Módulos ESM — uso de getWeatherByCoords importado
      const data = await getWeatherByCoords({
        latitude:    s.latitude,
        longitude:   s.longitude,
        name:        s.name,
        countryCode: s.countryCode
      });

      this.weather = data;

      // TEMA: JavaScript Avanzado — spread operator en addToHistory
      this.history = addToHistory(this.history, data.city);
      saveHistoryToStorage(this.history);

      // Limpiar el input tras búsqueda exitosa
      this.searchQuery = '';

    } catch (error) {
      this.hasError = true;
      this.errorMessage = error.message || 'Error al consultar el servicio meteorológico.';
    } finally {
      this.loading = false;
    }
  },

  /**
   * Cierra el dropdown de sugerencias
   */
  closeSuggestions() {
    this.showSuggestions = false;
    this.suggestions = [];
  },

  /**
   * Limpia el historial de búsquedas
   */
  clearHistory() {
    // TEMA: JavaScript Moderno — reasignar array vacío
    this.history = [];
    saveHistoryToStorage(this.history);
  }
});

// TEMA: Alpine.js — estrategia dual de registro para máxima compatibilidad
// con módulos ESM y distintos órdenes de carga de scripts

// Estrategia 1: Asignar a window (funciona cuando Alpine carga DESPUÉS)
// x-data="weatherApp()" llama a window.weatherApp() cuando Alpine inicializa
window.weatherApp = weatherApp;

// Estrategia 2: alpine:init listener (funciona cuando Alpine carga ANTES)
// Si Alpine ya estaba en window cuando este módulo termina, lo registramos también
if (typeof Alpine !== 'undefined') {
  Alpine.data('weatherApp', weatherApp);
} else {
  document.addEventListener('alpine:init', () => {
    Alpine.data('weatherApp', weatherApp);
  });
}

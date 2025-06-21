// Configuración de la aplicación
export const APP_CONFIG = {
    NAME: 'Somos Crédito',
    VERSION: '1.0.0',
    DESCRIPTION: 'Sistema de Gestión Financiera'
  };
  
  // Estados de las sucursales
  export const SUCURSAL_STATUS = {
    ACTIVE: true,
    INACTIVE: false
  };
  
  // Mensajes de la aplicación
  export const MESSAGES = {
    LOADING: 'Cargando...',
    ERROR_GENERIC: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
    ERROR_NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
    SUCCESS_CREATE: 'Creado exitosamente',
    SUCCESS_UPDATE: 'Actualizado exitosamente',
    SUCCESS_DELETE: 'Eliminado exitosamente',
    CONFIRM_DELETE: '¿Estás seguro de que deseas eliminar este elemento?',
    NO_DATA: 'No hay datos disponibles'
  };
  
  // Validaciones
  export const VALIDATION_RULES = {
    SUCURSAL: {
      NOMBRE_MIN_LENGTH: 3,
      NOMBRE_MAX_LENGTH: 100,
      DIRECCION_MIN_LENGTH: 10,
      DIRECCION_MAX_LENGTH: 255,
      TELEFONO_PATTERN: /^[0-9]{8}$|^[0-9]{4}-[0-9]{4}$|^\+502[0-9]{8}$/
    }
  };
  
  // Formatos de fecha
  export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',
    DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
    API: 'YYYY-MM-DD',
    API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss'
  };
  
  // Códigos de respuesta HTTP
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  };
  
  // Configuración de paginación
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  };
  
  // Colores del tema
  export const THEME_COLORS = {
    PRIMARY: '#007bff',
    SECONDARY: '#6c757d',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40'
  };
  
  // Rutas de la aplicación
  export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    SUCURSALES: '/sucursales',
    CLIENTES: '/clientes',
    CREDITOS: '/creditos',
    PAGOS: '/pagos',
    REPORTES: '/reportes'
  };
  
  // Configuración de formularios
  export const FORM_CONFIG = {
    DEBOUNCE_DELAY: 300,
    AUTO_SAVE_DELAY: 2000
  };
  
  export default {
    APP_CONFIG,
    SUCURSAL_STATUS,
    MESSAGES,
    VALIDATION_RULES,
    DATE_FORMATS,
    HTTP_STATUS,
    PAGINATION,
    THEME_COLORS,
    ROUTES,
    FORM_CONFIG
  };
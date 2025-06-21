import axios from 'axios';

// Configuración base de la API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para peticiones
api.interceptors.request.use(
  (config) => {
    
    
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Manejo de errores globales
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      console.error('Error de red:', error.request);
    } else {
      // Algo más causó el error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
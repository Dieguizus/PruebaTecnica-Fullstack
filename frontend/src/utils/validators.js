// Validador requerido
export const required = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'Este campo es requerido';
  }
  return null;
};

// Validador de longitud mínima
export const minLength = (min) => (value) => {
  if (value && value.trim().length < min) {
    return `Debe tener al menos ${min} caracteres`;
  }
  return null;
};

// Validador de longitud máxima
export const maxLength = (max) => (value) => {
  if (value && value.length > max) {
    return `No debe exceder ${max} caracteres`;
  }
  return null;
};

// Validador de email
export const email = (value) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Formato de email inválido';
  }
  return null;
};

// Validador de teléfono (formato guatemalteco) - MÁS PERMISIVO
export const phone = (value) => {
  if (!value) return 'El teléfono es obligatorio';
  
  // Limpiar el valor
  const cleanValue = value.replace(/\D/g, '');
  
  // Verificar que tenga al menos 8 dígitos
  if (cleanValue.length < 8) {
    return 'El teléfono debe tener al menos 8 dígitos';
  }
  
  // Verificar formatos válidos
  const patterns = [
    /^[0-9]{8}$/,                    // 12345678
    /^[0-9]{4}-[0-9]{4}$/,          // 1234-5678
    /^\+502[0-9]{8}$/,              // +50212345678
    /^502[0-9]{8}$/                 // 50212345678
  ];
  
  const isValid = patterns.some(pattern => pattern.test(value));
  
  if (!isValid) {
    return 'Formato de teléfono inválido (ej: 12345678, 1234-5678, +50212345678)';
  }
  
  return null;
};

// Validador de dirección - MÁS PERMISIVO
export const address = (value) => {
  if (!value || value.trim().length < 5) {
    return 'La dirección debe tener al menos 5 caracteres';
  }
  return null;
};

// Combinador de validadores
export const combineValidators = (...validators) => (value, allValues) => {
  for (const validator of validators) {
    const error = validator(value, allValues);
    if (error) {
      return error;
    }
  }
  return null;
};

// Validadores específicos para sucursales - SIMPLIFICADOS
export const sucursalValidators = {
  nombre: (value) => {
    if (!value || value.trim() === '') {
      return 'El nombre es obligatorio';
    }
    if (value.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (value.length > 100) {
      return 'El nombre no debe exceder 100 caracteres';
    }
    return null;
  },
  
  direccion: (value) => {
    if (!value || value.trim() === '') {
      return 'La dirección es obligatoria';
    }
    if (value.trim().length < 5) {
      return 'La dirección debe tener al menos 5 caracteres';
    }
    if (value.length > 255) {
      return 'La dirección no debe exceder 255 caracteres';
    }
    return null;
  },
  
  telefono: (value) => {
    if (!value || value.trim() === '') {
      return 'El teléfono es obligatorio';
    }
    
    // Limpiar el valor
    const cleanValue = value.replace(/\D/g, '');
    
    // Verificar que tenga al menos 8 dígitos
    if (cleanValue.length < 8) {
      return 'El teléfono debe tener al menos 8 dígitos';
    }
    
    return null;
  }
};

export default {
  required,
  minLength,
  maxLength,
  email,
  phone,
  address,
  combineValidators,
  sucursalValidators
};
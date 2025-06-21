// Formatear fecha
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'No disponible';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    try {
      return new Date(dateString).toLocaleDateString('es-GT', defaultOptions);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };
  
  // Formatear fecha con hora
  export const formatDateTime = (dateString) => {
    return formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formatear teléfono guatemalteco
  export const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Limpiar el número
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Si es un número de 8 dígitos
    if (cleanPhone.length === 8) {
      return cleanPhone.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    
    // Si es un número con código de país
    if (cleanPhone.length === 11 && cleanPhone.startsWith('502')) {
      const localNumber = cleanPhone.substring(3);
      return `+502 ${localNumber.replace(/(\d{4})(\d{4})/, '$1-$2')}`;
    }
    
    return phone; // Devolver original si no coincide con los patrones
  };
  
  // Formatear moneda (Quetzales)
  export const formatCurrency = (amount, currency = 'GTQ') => {
    if (amount === null || amount === undefined) return 'Q 0.00';
    
    try {
      return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Error al formatear moneda:', error);
      return `Q ${amount.toFixed(2)}`;
    }
  };
  
  // Formatear número con separadores de miles
  export const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';
    
    try {
      return new Intl.NumberFormat('es-GT').format(number);
    } catch (error) {
      console.error('Error al formatear número:', error);
      return number.toString();
    }
  };
  
  // Formatear porcentaje
  export const formatPercentage = (value, decimals = 2) => {
    if (value === null || value === undefined) return '0%';
    
    try {
      return `${(value * 100).toFixed(decimals)}%`;
    } catch (error) {
      console.error('Error al formatear porcentaje:', error);
      return `${value}%`;
    }
  };
  
  // Capitalizar primera letra
  export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  // Formatear nombre completo
  export const formatFullName = (firstName, lastName) => {
    const first = firstName ? capitalize(firstName.trim()) : '';
    const last = lastName ? capitalize(lastName.trim()) : '';
    
    return [first, last].filter(Boolean).join(' ');
  };
  
  // Truncar texto
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
  };
  
  // Formatear tiempo relativo (hace X tiempo)
  export const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return 'Hace unos segundos';
      }
      
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
      }
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      }
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      }
      
      return formatDate(dateString);
    } catch (error) {
      console.error('Error al formatear tiempo relativo:', error);
      return formatDate(dateString);
    }
  };
  
  // Formatear tamaño de archivo
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  export default {
    formatDate,
    formatDateTime,
    formatPhone,
    formatCurrency,
    formatNumber,
    formatPercentage,
    capitalize,
    formatFullName,
    truncateText,
    formatRelativeTime,
    formatFileSize
  };
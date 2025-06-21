import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Cargando...', 
  overlay = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const spinnerContent = (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}>
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

// Componente específico para overlays de página completa
export const FullPageLoader = ({ message = 'Cargando aplicación...' }) => (
  <div className="full-page-loader">
    <div className="loader-content">
      <div className="company-logo">
        <span className="logo-text">Somos Crédito</span>
      </div>
      <LoadingSpinner size="large" message={message} />
    </div>
  </div>
);

// Componente para botones con carga
export const ButtonSpinner = ({ size = 'small' }) => (
  <span className={`button-spinner ${size}`}>
    <span className="spinner-dot"></span>
    <span className="spinner-dot"></span>
    <span className="spinner-dot"></span>
  </span>
);

export default LoadingSpinner;
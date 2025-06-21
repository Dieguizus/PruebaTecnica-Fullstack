import React from 'react';

const SucursalCard = ({ sucursal, onEdit, onDeactivate, onReactivate }) => {
  const { id, nombre, direccion, telefono, activo, createdAt, updatedAt } = sucursal;

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Formatear teléfono para mostrar
  const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Si es un número de 8 dígitos sin formato, agregamos el guión
    if (phone.length === 8 && /^\d+$/.test(phone)) {
      return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    
    return phone;
  };

  return (
    <div className={`sucursal-card ${!activo ? 'inactive' : ''}`}>
      {/* Header de la tarjeta */}
      <div className="card-header">
        <div className="card-title">
          <h3>{nombre}</h3>
          <span className={`status-badge ${activo ? 'active' : 'inactive'}`}>
            {activo ? 'Activa' : 'Inactiva'}
          </span>
        </div>
        
        <div className="card-actions">
          <button
            onClick={() => onEdit(sucursal)}
            className="action-btn edit-btn"
            title="Editar sucursal"
          >
            ✏️
          </button>
          
          {activo ? (
            <button
              onClick={() => onDeactivate(sucursal)}
              className="action-btn deactivate-btn"
              title="Desactivar sucursal"
            >
              🚫
            </button>
          ) : (
            <button
              onClick={() => onReactivate(sucursal)}
              className="action-btn reactivate-btn"
              title="Reactivar sucursal"
            >
              ✅
            </button>
          )}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="card-content">
        {/* Información de contacto */}
        <div className="info-section">
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div className="info-details">
              <label>Dirección:</label>
              <p>{direccion}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">📞</span>
            <div className="info-details">
              <label>Teléfono:</label>
              <p>
                <a href={`tel:${telefono}`} className="phone-link">
                  {formatPhone(telefono)}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Información de fechas */}
        <div className="dates-section">
          <div className="date-item">
            <span className="date-label">Creada:</span>
            <span className="date-value">{formatDate(createdAt)}</span>
          </div>
          
          {updatedAt && updatedAt !== createdAt && (
            <div className="date-item">
              <span className="date-label">Actualizada:</span>
              <span className="date-value">{formatDate(updatedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer de la tarjeta */}
      <div className="card-footer">
        <div className="sucursal-id">
          ID: {id}
        </div>
        
        <div className="quick-actions">
          <button
            onClick={() => onEdit(sucursal)}
            className="btn btn-sm btn-outline"
          >
            Editar
          </button>
          
          {activo ? (
            <button
              onClick={() => onDeactivate(sucursal)}
              className="btn btn-sm btn-danger"
            >
              Desactivar
            </button>
          ) : (
            <button
              onClick={() => onReactivate(sucursal)}
              className="btn btn-sm btn-success"
            >
              Reactivar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SucursalCard;
import React, { useEffect } from 'react';

const ConfirmModal = ({
  show = false,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmClass = 'btn-primary',
  onConfirm,
  onCancel,
  loading = false,
  icon = null
}) => {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show && !loading) {
        onCancel();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
    };
  }, [show, loading, onCancel]);

  // No renderizar si no se debe mostrar
  if (!show) return null;

  // Prevenir cierre del modal si está cargando
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  // Iconos por defecto según el tipo de acción
  const getDefaultIcon = () => {
    if (confirmClass.includes('danger')) return '⚠️';
    if (confirmClass.includes('success')) return '✅';
    if (confirmClass.includes('warning')) return '⚡';
    return '❓';
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content confirm-modal">
        {/* Header del modal */}
        <div className="modal-header">
          <div className="modal-title">
            {(icon || getDefaultIcon()) && (
              <span className="modal-icon">{icon || getDefaultIcon()}</span>
            )}
            <h3>{title}</h3>
          </div>
          
          {!loading && (
            <button
              type="button"
              className="close-btn"
              onClick={onCancel}
              aria-label="Cerrar"
            >
              ✕
            </button>
          )}
        </div>

        {/* Contenido del modal */}
        <div className="modal-body">
          <p className="confirm-message">{message}</p>
        </div>

        {/* Footer con botones */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`btn ${confirmClass}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente específico para confirmación de eliminación
export const DeleteConfirmModal = ({ 
  show, 
  itemName, 
  onConfirm, 
  onCancel, 
  loading = false 
}) => (
  <ConfirmModal
    show={show}
    title="Confirmar eliminación"
    message={`¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`}
    confirmText="Eliminar"
    cancelText="Cancelar"
    confirmClass="btn-danger"
    onConfirm={onConfirm}
    onCancel={onCancel}
    loading={loading}
    icon="🗑️"
  />
);

// Componente específico para confirmación de desactivación
export const DeactivateConfirmModal = ({ 
  show, 
  itemName, 
  onConfirm, 
  onCancel, 
  loading = false 
}) => (
  <ConfirmModal
    show={show}
    title="Confirmar desactivación"
    message={`¿Estás seguro de que deseas desactivar "${itemName}"?`}
    confirmText="Desactivar"
    cancelText="Cancelar"
    confirmClass="btn-warning"
    onConfirm={onConfirm}
    onCancel={onCancel}
    loading={loading}
    icon="🚫"
  />
);

export default ConfirmModal;
import React, { useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { sucursalValidators } from '../../utils/validators';

const SucursalForm = ({ sucursal, onSubmit, onCancel, loading = false }) => {
  const isEditing = !!sucursal;

  const initialValues = {
    nombre: '',
    direccion: '',
    telefono: '',
    activo: true
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setFormValues,
    isValid
  } = useForm(initialValues, sucursalValidators);

  // Cargar datos de la sucursal si estamos editando
  useEffect(() => {
    if (sucursal) {
      setFormValues({
        nombre: sucursal.nombre || '',
        direccion: sucursal.direccion || '',
        telefono: sucursal.telefono || '',
        activo: sucursal.activo ?? true
      });
    }
  }, [sucursal, setFormValues]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validar que todos los campos requeridos estén presentes
    if (!values.nombre || !values.direccion || !values.telefono) {
      return;
    }
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  // Manejar clic del botón específicamente
  const handleButtonClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validar antes de enviar
    if (!values.nombre || !values.direccion || !values.telefono) {
      return;
    }
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  };

  // Formatear teléfono mientras se escribe
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    
    // Formatear con guión si tiene 8 dígitos
    if (value.length === 8) {
      value = value.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    
    e.target.value = value;
    handleChange(e);
  };

  // Verificar si el formulario es válido
  const formIsValid = values.nombre && values.direccion && values.telefono;

  return (
    <div className="sucursal-form">
      <div className="form-header">
        <h2>{isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}</h2>
        <button 
          type="button" 
          className="close-btn"
          onClick={onCancel}
          disabled={loading}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form" noValidate>
        {/* Nombre de la sucursal */}
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">
            Nombre de la Sucursal *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.nombre && touched.nombre ? 'error' : ''}`}
            placeholder="Ej: Sucursal Central"
            disabled={loading}
            maxLength="100"
            autoComplete="off"
          />
          {errors.nombre && touched.nombre && (
            <span className="error-text">{errors.nombre}</span>
          )}
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label htmlFor="direccion" className="form-label">
            Dirección *
          </label>
          <textarea
            id="direccion"
            name="direccion"
            value={values.direccion}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-textarea ${errors.direccion && touched.direccion ? 'error' : ''}`}
            placeholder="Ej: 5ta Avenida 12-34, Zona 1, Ciudad de Guatemala"
            disabled={loading}
            maxLength="255"
            rows="3"
            autoComplete="off"
          />
          <div className="character-count">
            {values.direccion.length}/255 caracteres
          </div>
          {errors.direccion && touched.direccion && (
            <span className="error-text">{errors.direccion}</span>
          )}
        </div>

        {/* Teléfono */}
        <div className="form-group">
          <label htmlFor="telefono" className="form-label">
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={values.telefono}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            className={`form-input ${errors.telefono && touched.telefono ? 'error' : ''}`}
            placeholder="Ej: 2234-5678"
            disabled={loading}
            maxLength="15"
            autoComplete="off"
          />
          <small className="form-help">
            Formatos aceptados: 12345678, 1234-5678, +50212345678
          </small>
          {errors.telefono && touched.telefono && (
            <span className="error-text">{errors.telefono}</span>
          )}
        </div>

        {/* Estado activo (solo en edición) */}
        {isEditing && (
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="activo"
                checked={values.activo}
                onChange={handleChange}
                disabled={loading}
                className="form-checkbox"
              />
              <span className="checkbox-text">Sucursal activa</span>
            </label>
            <small className="form-help">
              Las sucursales inactivas no aparecerán en listados públicos
            </small>
          </div>
        )}

        {/* Información adicional */}
        <div className="form-info">
          <div className="info-item">
            <span className="info-label">Campos obligatorios:</span>
            <span className="info-value">Marcados con *</span>
          </div>
          {isEditing && (
            <div className="info-item">
              <span className="info-label">Última actualización:</span>
              <span className="info-value">
                {sucursal?.updatedAt 
                  ? new Date(sucursal.updatedAt).toLocaleString('es-GT')
                  : 'No disponible'
                }
              </span>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleButtonClick}
            className="btn btn-primary"
            disabled={loading || !formIsValid}
            style={{
              opacity: (loading || !formIsValid) ? 0.6 : 1,
              cursor: (loading || !formIsValid) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isEditing ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              isEditing ? 'Actualizar Sucursal' : 'Crear Sucursal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SucursalForm;
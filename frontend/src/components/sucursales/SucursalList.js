import React, { useState } from 'react';
import { useSucursales } from '../../hooks/useSucursales';
import SucursalForm from './SucursalForm';
import SucursalCard from './SucursalCard';
import Modal from './SucursalModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { DeleteConfirmModal } from '../common/ConfirmModal';
import DeletedSucursalSearch from './DeletedSucursalSearch';
import '../../styles/sucursales.css';

const SucursalList = () => {
  const {
    sucursales,
    loading,
    error,
    createSucursal,
    updateSucursal,
    deactivateSucursal,
    reactivateSucursal,
    searchAndAddDeletedSucursal
  } = useSucursales();

  // Estados del componente
  const [showForm, setShowForm] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sucursalToDelete, setSucursalToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [showDeletedSearch, setShowDeletedSearch] = useState(false);

  // Filtrar sucursales según el filtro seleccionado
  const filteredSucursales = sucursales.filter(sucursal => {
    if (filter === 'active') return sucursal.activo && !sucursal.deletedAt;
    if (filter === 'inactive') return !sucursal.activo || sucursal.deletedAt;
    return true; // 'all'
  });

  // Manejar nueva sucursal
  const handleNewSucursal = () => {
    setEditingSucursal(null);
    setShowForm(true);
  };

  // Manejar editar sucursal
  const handleEditSucursal = (sucursal) => {
    setEditingSucursal(sucursal);
    setShowForm(true);
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (formData) => {
    console.log('📤 Enviando datos del formulario:', formData);
    setFormLoading(true);
    
    try {
      if (editingSucursal) {
        console.log('🔄 Actualizando sucursal ID:', editingSucursal.id);
        await updateSucursal(editingSucursal.id, formData);
        console.log('✅ Sucursal actualizada exitosamente');
      } else {
        console.log('🆕 Creando nueva sucursal');
        await createSucursal(formData);
        console.log('✅ Sucursal creada exitosamente');
      }
      
      // Cerrar modal
      setShowForm(false);
      setEditingSucursal(null);
      
    } catch (error) {
      console.error('❌ Error en el formulario:', error);
      // El error ya se maneja en el hook useSucursales
    } finally {
      setFormLoading(false);
    }
  };

  // Manejar cancelar formulario
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSucursal(null);
  };

  // Manejar eliminar sucursal
  const handleDeleteSucursal = (sucursal) => {
    setSucursalToDelete(sucursal);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!sucursalToDelete) return;
    
    setDeleteLoading(true);
    try {
      console.log('🗑️ Eliminando sucursal ID:', sucursalToDelete.id);
      await deactivateSucursal(sucursalToDelete.id);
      console.log('✅ Sucursal eliminada exitosamente');
      
      setShowDeleteModal(false);
      setSucursalToDelete(null);
    } catch (error) {
      console.error('❌ Error al eliminar sucursal:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSucursalToDelete(null);
  };

  // Manejar reactivar sucursal
  const handleReactivateSucursal = async (sucursalId) => {
    try {
      console.log('↻ Reactivando sucursal ID:', sucursalId);
      await reactivateSucursal(sucursalId);
      console.log('✅ Sucursal reactivada exitosamente');
    } catch (error) {
      console.error('❌ Error al reactivar sucursal:', error);
    }
  };

  // 🆕 Manejar búsqueda de sucursales eliminadas
  const handleSearchDeleted = async (id) => {
    try {
      console.log('🔍 Buscando sucursal eliminada:', id);
      const sucursal = await searchAndAddDeletedSucursal(id);
      console.log('✅ Sucursal eliminada encontrada y agregada:', sucursal);
      
      // Cambiar filtro para mostrar inactivas para que sea visible
      setFilter('inactive');
    } catch (error) {
      console.error('❌ Error al buscar sucursal eliminada:', error);
      throw error; // Re-lanzar para que el componente de búsqueda lo maneje
    }
  };

  // Contar sucursales por estado
  const counts = {
    total: sucursales.length,
    active: sucursales.filter(s => s.activo && !s.deletedAt).length,
    inactive: sucursales.filter(s => !s.activo || s.deletedAt).length
  };

  if (loading && sucursales.length === 0) {
    return <LoadingSpinner size="large" message="Cargando sucursales..." overlay />;
  }

  return (
    <div className="sucursal-list">
      {/* Header */}
      <div className="list-header">
        <div className="header-content">
          <h1>Gestión de Sucursales</h1>
          <p className="subtitle">
            {counts.total > 0 
              ? `${counts.total} sucursal${counts.total !== 1 ? 'es' : ''} encontrada${counts.total !== 1 ? 's' : ''}`
              : 'No hay sucursales registradas'
            }
          </p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowDeletedSearch(!showDeletedSearch)}
            className="btn btn-outline btn-sm"
            title="Buscar sucursales eliminadas"
          >
            {showDeletedSearch ? '🔽' : '🔍'} Buscar Eliminadas
          </button>
          <button 
            onClick={handleNewSucursal}
            className="btn btn-primary btn-new"
          >
            <span className="btn-icon">+</span>
            Nueva Sucursal
          </button>
        </div>
      </div>

      {/* Búsqueda de sucursales eliminadas */}
      {showDeletedSearch && (
        <DeletedSucursalSearch
          onSearch={handleSearchDeleted}
          loading={loading}
        />
      )}

      {/* Filtros */}
      {counts.total > 0 && (
        <div className="filters">
          <div className="filter-buttons">
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              Todas ({counts.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            >
              Activas ({counts.active})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            >
              Inactivas ({counts.inactive})
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Contenido principal */}
      {counts.total === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>No hay sucursales registradas</h3>
          <p>Comienza agregando tu primera sucursal</p>
          <button 
            onClick={handleNewSucursal}
            className="btn btn-primary"
          >
            Crear Primera Sucursal
          </button>
        </div>
      ) : (
        <>
          {filteredSucursales.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No hay sucursales que coincidan con el filtro</h3>
              <p>Prueba cambiando el filtro seleccionado</p>
              {filter === 'inactive' && (
                <button 
                  onClick={() => setShowDeletedSearch(true)}
                  className="btn btn-outline"
                >
                  🔍 Buscar Sucursales Eliminadas
                </button>
              )}
            </div>
          ) : (
            <div className="sucursales-grid">
              {filteredSucursales.map((sucursal) => (
                <SucursalCard
                  key={sucursal.id}
                  sucursal={sucursal}
                  onEdit={handleEditSucursal}
                  onDeactivate={handleDeleteSucursal}
                  onReactivate={() => handleReactivateSucursal(sucursal.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal del formulario */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={editingSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
        size="medium"
        closeOnBackdrop={!formLoading}
        closeOnEscape={!formLoading}
      >
        <SucursalForm
          sucursal={editingSucursal}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmModal
        show={showDeleteModal}
        itemName={sucursalToDelete?.nombre}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />

      {/* Loading overlay para operaciones */}
      {loading && sucursales.length > 0 && (
        <LoadingSpinner message="Procesando..." overlay />
      )}
    </div>
  );
};

export default SucursalList;
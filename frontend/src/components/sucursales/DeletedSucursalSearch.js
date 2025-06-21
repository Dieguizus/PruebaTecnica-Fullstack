import React, { useState } from 'react';

const DeletedSucursalSearch = ({ onSearch, loading = false }) => {
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Por favor ingresa un ID válido');
      return;
    }

    setError(null);
    setResult(null);
    
    try {
      console.log('🔍 Iniciando búsqueda para ID:', searchId.trim());
      const sucursal = await onSearch(searchId.trim());
      
      console.log('✅ Resultado de búsqueda:', sucursal);
      
      // Verificar que la sucursal existe y tiene datos válidos
      if (sucursal && sucursal.id) {
        // Determinar el tipo de resultado basado en la información adicional
        let resultType = 'success';
        let message = '';
        let icon = '✅';
        
        if (sucursal._searchResult?.wasAlreadyActive) {
          message = `ℹ️ La sucursal "${sucursal.nombre}" ya estaba activa`;
          resultType = 'info';
          icon = 'ℹ️';
        } else if (sucursal._searchResult?.wasReactivated) {
          message = `✅ Sucursal "${sucursal.nombre}" encontrada y reactivada`;
          resultType = 'success';
          icon = '✅';
        } else {
          message = `✅ Sucursal "${sucursal.nombre}" encontrada`;
          resultType = 'success';
          icon = '✅';
        }
        
        setResult({
          type: resultType,
          message: message,
          icon: icon,
          sucursal: {
            ...sucursal,
            // Limpiar la información interna
            _searchResult: undefined
          }
        });
        setSearchId(''); // Limpiar después de buscar exitosamente
      } else {
        console.warn('⚠️ Sucursal encontrada pero con datos incompletos:', sucursal);
        setResult({
          type: 'success',
          message: '✅ Sucursal encontrada (verifica la lista principal)',
          icon: '✅',
          sucursal: null
        });
        setSearchId(''); // Limpiar después de buscar
      }
      
    } catch (err) {
      console.error('❌ Error en búsqueda:', err);
      const errorMessage = err.message || 'Error al buscar la sucursal';
      setError(errorMessage);
      setResult({
        type: 'error',
        message: `❌ ${errorMessage}`,
        icon: '❌',
        sucursal: null
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="deleted-search-container">
      <div className="deleted-search-header">
        <h4>🔍 Buscar Sucursales</h4>
        <p>
          Busca una sucursal por su ID. Si está eliminada, se reactivará automáticamente.
        </p>
      </div>
      
      <div className="deleted-search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Ingresa el ID de la sucursal..."
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              // Limpiar mensajes cuando el usuario empiece a escribir
              if (result || error) {
                clearResult();
              }
            }}
            onKeyPress={handleKeyPress}
            className="search-input"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={!searchId.trim() || loading}
            className="btn btn-primary search-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Buscando...
              </>
            ) : (
              <>
                🔍 Buscar
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="search-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button 
              onClick={clearResult}
              className="error-close"
              title="Cerrar mensaje"
            >
              ✕
            </button>
          </div>
        )}
        
        {result && (
          <div className={`search-result ${result.type}`}>
            <span className="result-icon">
              {result.icon}
            </span>
            <div className="result-content">
              <p>{result.message}</p>
              {result.sucursal && result.sucursal.id && (
                <div className="result-details">
                  <p><strong>ID:</strong> {result.sucursal.id}</p>
                  <p><strong>Nombre:</strong> {result.sucursal.nombre || 'No disponible'}</p>
                  <p><strong>Dirección:</strong> {result.sucursal.direccion || 'No disponible'}</p>
                  <p><strong>Teléfono:</strong> {result.sucursal.telefono || 'No disponible'}</p>
                  <p><strong>Estado:</strong> <span className="badge badge-active">Activa</span></p>
                </div>
              )}
              <div className="success-note">
                <small>
                  {result.type === 'info' 
                    ? '📝 La sucursal ya se encuentra en la lista principal.'
                    : '📝 La sucursal aparece en la lista principal arriba.'
                  }
                </small>
              </div>
            </div>
            <button 
              onClick={clearResult}
              className="result-close"
              title="Cerrar mensaje"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="search-help">
          <small>
            💡 <strong>Cómo funciona:</strong>
            <br />
            • Si la sucursal está activa → Te muestra que ya está activa
            <br />
            • Si está eliminada → La reactiva automáticamente
            <br />
            • Si no existe → Te muestra un error
          </small>
        </div>
      </div>
    </div>
  );
};

export default DeletedSucursalSearch;
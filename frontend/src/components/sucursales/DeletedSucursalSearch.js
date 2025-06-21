import React, { useState } from 'react';

const DeletedSucursalSearch = ({ onSearch, loading = false }) => {
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Por favor ingresa un ID válido');
      return;
    }

    setError(null);
    
    try {
      await onSearch(searchId.trim());
      setSearchId(''); // Limpiar después de buscar
    } catch (err) {
      setError(err.message || 'Error al buscar la sucursal');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="deleted-search-container">
      <div className="deleted-search-header">
        <h4>🔍 Buscar Sucursales Eliminadas</h4>
        <p>Si una sucursal fue eliminada y no aparece en la lista, búscala por ID para poder reactivarla.</p>
      </div>
      
      <div className="deleted-search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Ingresa el ID de la sucursal eliminada..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
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
            {error}
          </div>
        )}
        
        <div className="search-help">
          <small>
            💡 <strong>Tip:</strong> Si eliminaste una sucursal por error, búscala aquí por su ID para poder reactivarla.
          </small>
        </div>
      </div>
    </div>
  );
};

export default DeletedSucursalSearch;
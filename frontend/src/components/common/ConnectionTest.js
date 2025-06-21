import React, { useState } from 'react';
import api from '../../services/api';

const ConnectionTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('🧪 Probando conexión con el backend...');
      
      // Probar conexión básica
      const response = await api.get('/');
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      setResult({
        success: true,
        message: 'Conexión exitosa con el backend',
        data: response.data
      });
      
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      
      setResult({
        success: false,
        message: error.response?.data?.message || error.message || 'Error de conexión',
        error: error.response?.status || 'NETWORK_ERROR'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔧 Prueba de Conexión</h3>
      
      <button 
        onClick={testConnection}
        disabled={testing}
        style={{
          padding: '10px 20px',
          backgroundColor: testing ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer'
        }}
      >
        {testing ? 'Probando...' : 'Probar Conexión'}
      </button>

      {result && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: result.success ? '#155724' : '#721c24'
        }}>
          <strong>{result.success ? '✅' : '❌'} {result.message}</strong>
          
          {result.data && (
            <pre style={{ 
              marginTop: '10px', 
              fontSize: '12px',
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
          
          {result.error && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              Código de error: {result.error}
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>URL de la API:</strong> {process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'}
      </div>
    </div>
  );
};

export default ConnectionTest;
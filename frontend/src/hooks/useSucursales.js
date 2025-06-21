import { useState, useEffect, useCallback } from 'react';
import sucursalService from '../services/sucursalService';

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las sucursales
  const loadSucursales = useCallback(async () => {
    console.log('🔄 Cargando sucursales...');
    setLoading(true);
    setError(null);
    try {
      const data = await sucursalService.getAll();
      console.log('✅ Sucursales cargadas:', data);
      setSucursales(data);
    } catch (err) {
      console.error('❌ Error al cargar sucursales:', err);
      setError('Error al cargar las sucursales');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva sucursal
  const createSucursal = useCallback(async (sucursalData) => {
    console.log('🚀 Creando sucursal con datos:', sucursalData);
    setLoading(true);
    setError(null);
    
    try {
      // Limpiar y preparar los datos
      const cleanData = {
        nombre: sucursalData.nombre.trim(),
        direccion: sucursalData.direccion.trim(),
        telefono: sucursalData.telefono.trim(),
        activo: sucursalData.activo ?? true
      };
      
      console.log('📤 Datos limpiados para enviar:', cleanData);
      
      const newSucursal = await sucursalService.create(cleanData);
      console.log('✅ Sucursal creada exitosamente:', newSucursal);
      
      // Actualizar la lista local
      setSucursales(prev => {
        const updated = [...prev, newSucursal];
        console.log('📝 Lista actualizada:', updated);
        return updated;
      });
      
      return newSucursal;
    } catch (err) {
      console.error('❌ Error al crear sucursal:', err);
      console.error('❌ Respuesta del servidor:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Error al crear la sucursal';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar sucursal
  const updateSucursal = useCallback(async (id, sucursalData) => {
    console.log('🔄 Actualizando sucursal ID:', id, 'con datos:', sucursalData);
    setLoading(true);
    setError(null);
    
    try {
      // Limpiar y preparar los datos
      const cleanData = {
        nombre: sucursalData.nombre.trim(),
        direccion: sucursalData.direccion.trim(),
        telefono: sucursalData.telefono.trim(),
        activo: sucursalData.activo ?? true
      };
      
      console.log('📤 Datos limpiados para actualizar:', cleanData);
      
      const updatedSucursal = await sucursalService.update(id, cleanData);
      console.log('✅ Sucursal actualizada exitosamente:', updatedSucursal);
      
      setSucursales(prev => 
        prev.map(sucursal => 
          sucursal.id === id ? updatedSucursal : sucursal
        )
      );
      
      return updatedSucursal;
    } catch (err) {
      console.error('❌ Error al actualizar sucursal:', err);
      console.error('❌ Respuesta del servidor:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Error al actualizar la sucursal';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar sucursal (soft delete)
  const deactivateSucursal = useCallback(async (id) => {
    console.log('🚫 Desactivando sucursal ID:', id);
    setLoading(true);
    setError(null);
    
    try {
      await sucursalService.deactivate(id);
      console.log('✅ Sucursal desactivada exitosamente');
      
      // Remover de la lista local (ya que el backend la oculta)
      setSucursales(prev => prev.filter(sucursal => sucursal.id !== id));
      
    } catch (err) {
      console.error('❌ Error al desactivar sucursal:', err);
      setError('Error al desactivar la sucursal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🆕 NUEVA FUNCIÓN: Buscar y agregar sucursal eliminada por ID
  const searchAndAddDeletedSucursal = useCallback(async (id) => {
    console.log('🔍 Buscando sucursal eliminada ID:', id);
    setLoading(true);
    setError(null);
    
    try {
      // Verificar si ya está en la lista local
      const existsInLocal = sucursales.find(s => s.id.toString() === id.toString());
      if (existsInLocal) {
        console.log('✅ Sucursal ya existe en la lista local');
        return existsInLocal;
      }
      
      // Buscar en el servidor
      const sucursal = await sucursalService.getById(id);
      
      if (sucursal) {
        console.log('✅ Sucursal encontrada:', sucursal);
        
        // Agregar a la lista local
        setSucursales(prev => {
          const exists = prev.find(s => s.id === sucursal.id);
          if (!exists) {
            return [...prev, sucursal];
          }
          return prev;
        });
        
        return sucursal;
      }
      
      throw new Error('Sucursal no encontrada');
      
    } catch (err) {
      console.error('❌ Error al buscar sucursal eliminada:', err);
      const errorMessage = `No se encontró sucursal con ID: ${id}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [sucursales]);

  // Reactivar sucursal
  const reactivateSucursal = useCallback(async (id) => {
    console.log('✅ Reactivando sucursal ID:', id);
    setLoading(true);
    setError(null);
    
    try {
      const reactivatedSucursal = await sucursalService.reactivate(id);
      console.log('✅ Sucursal reactivada exitosamente:', reactivatedSucursal);
      
      // Actualizar la sucursal en la lista local
      setSucursales(prev => 
        prev.map(sucursal => 
          sucursal.id === id ? { ...reactivatedSucursal, deletedAt: null } : sucursal
        )
      );
      
      return reactivatedSucursal;
    } catch (err) {
      console.error('❌ Error al reactivar sucursal:', err);
      setError('Error al reactivar la sucursal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener sucursal por ID
  const getSucursalById = useCallback(async (id) => {
    console.log('🔍 Obteniendo sucursal por ID:', id);
    
    // Primero buscar en la lista local
    const localSucursal = sucursales.find(s => s.id.toString() === id.toString());
    if (localSucursal) {
      console.log('✅ Sucursal encontrada en caché local:', localSucursal);
      return localSucursal;
    }
    
    // Si no está en local, buscar en el servidor y agregar a la lista
    try {
      const sucursal = await searchAndAddDeletedSucursal(id);
      return sucursal;
    } catch (error) {
      // Si falla la búsqueda, intentar búsqueda directa
      setLoading(true);
      setError(null);
      
      try {
        const sucursal = await sucursalService.getById(id);
        console.log('✅ Sucursal obtenida del servidor:', sucursal);
        
        // Agregar a la lista si no existe
        setSucursales(prev => {
          const exists = prev.find(s => s.id === sucursal.id);
          if (!exists) {
            return [...prev, sucursal];
          }
          return prev;
        });
        
        return sucursal;
      } catch (err) {
        console.error('❌ Error al obtener sucursal:', err);
        setError('Error al obtener la sucursal');
        throw err;
      } finally {
        setLoading(false);
      }
    }
  }, [sucursales, searchAndAddDeletedSucursal]);

  // Cargar sucursales al montar el componente
  useEffect(() => {
    console.log('🎯 useEffect: Cargando sucursales iniciales');
    loadSucursales();
  }, [loadSucursales]);

  // Debug: Mostrar estado actual
  useEffect(() => {
    console.log('📊 Estado actual del hook:', {
      sucursales: sucursales.length,
      loading,
      error
    });
  }, [sucursales, loading, error]);

  return {
    sucursales,
    loading,
    error,
    loadSucursales,
    createSucursal,
    updateSucursal,
    deactivateSucursal,
    reactivateSucursal,
    getSucursalById,
    searchAndAddDeletedSucursal // 🆕 Nueva función exportada
  };
};

export default useSucursales;
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
      setLoading(false);
      
      // Crear un objeto con información adicional sobre el estado
      return {
        ...existsInLocal,
        _searchResult: {
          wasAlreadyActive: true,
          message: 'La sucursal ya estaba en la lista'
        }
      };
    }
    
    // ESTRATEGIA: Usar el endpoint de reactivación para encontrar sucursales eliminadas
    try {
      console.log('🔄 Intentando reactivar sucursal...');
      const reactivateResponse = await sucursalService.reactivate(id);
      
      console.log('✅ Respuesta de reactivación:', reactivateResponse);
      
      // Extraer la sucursal de la respuesta
      const sucursal = reactivateResponse?.data || reactivateResponse;
      
      if (!sucursal || !sucursal.id) {
        console.warn('⚠️ Respuesta de reactivación sin datos válidos:', reactivateResponse);
        throw new Error('Respuesta del servidor incompleta');
      }
      
      console.log('✅ Sucursal reactivada exitosamente:', sucursal);
      
      // Crear objeto sucursal limpio
      const sucursalLimpia = {
        id: sucursal.id,
        nombre: sucursal.nombre || '',
        direccion: sucursal.direccion || '',
        telefono: sucursal.telefono || '',
        activo: true, // Reactivada
        deletedAt: null, // Ya no está eliminada
        createdAt: sucursal.createdAt,
        updatedAt: sucursal.updatedAt || new Date().toISOString(),
        _searchResult: {
          wasReactivated: true,
          message: 'Sucursal encontrada y reactivada'
        }
      };
      
      // Agregar a la lista local
      setSucursales(prev => {
        const exists = prev.find(s => s.id === sucursalLimpia.id);
        if (!exists) {
          console.log('📝 Agregando sucursal reactivada a la lista');
          return [...prev, sucursalLimpia];
        } else {
          console.log('📝 Actualizando sucursal existente en la lista');
          return prev.map(s => 
            s.id === sucursalLimpia.id ? sucursalLimpia : s
          );
        }
      });
      
      return sucursalLimpia;
      
    } catch (reactivateError) {
      console.error('❌ Error en reactivación:', reactivateError);
      
      // Analizar el tipo de error
      if (reactivateError.response?.status === 404) {
        throw new Error(`No se encontró sucursal con ID: ${id}`);
      } else if (reactivateError.response?.status === 400) {
        // Error 400 generalmente significa que ya está activa
        const errorMessage = reactivateError.response?.data?.message || '';
        
        if (errorMessage.toLowerCase().includes('ya está activa') || 
            errorMessage.toLowerCase().includes('already active')) {
          console.log('💡 Sucursal ya está activa, buscando...');
          
          try {
            const getResponse = await sucursalService.getById(id);
            const sucursal = getResponse?.data || getResponse;
            
            if (!sucursal || !sucursal.id) {
              throw new Error('Sucursal encontrada pero sin datos válidos');
            }
            
            console.log('✅ Sucursal ya estaba activa:', sucursal);
            
            // Crear objeto con información de que ya estaba activa
            const sucursalConInfo = {
              ...sucursal,
              _searchResult: {
                wasAlreadyActive: true,
                message: 'La sucursal ya estaba activa'
              }
            };
            
            // Agregar a la lista si no existe
            setSucursales(prev => {
              const exists = prev.find(s => s.id === sucursal.id);
              if (!exists) {
                return [...prev, sucursalConInfo];
              }
              // Actualizar con la información adicional
              return prev.map(s => 
                s.id === sucursal.id ? sucursalConInfo : s
              );
            });
            
            return sucursalConInfo;
            
          } catch (getError) {
            console.error('❌ Error en búsqueda normal:', getError);
            throw new Error(`No se encontró sucursal con ID: ${id}`);
          }
        } else {
          throw new Error(`Error al buscar sucursal: ${errorMessage}`);
        }
      } else {
        throw new Error(`Error al buscar sucursal: ${reactivateError.response?.data?.message || reactivateError.message}`);
      }
    }
    
  } catch (err) {
    console.error('❌ Error general en búsqueda:', err);
    const errorMessage = err.message || `No se encontró sucursal con ID: ${id}`;
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

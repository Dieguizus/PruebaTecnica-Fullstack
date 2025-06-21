import api from './api';

const SUCURSALES_ENDPOINT = process.env.REACT_APP_SUCURSALES_ENDPOINT || '/sucursales';

export const sucursalService = {
  // GET /api/sucursales - Obtener todas las sucursales
  getAll: async () => {
    try {
      const response = await api.get(SUCURSALES_ENDPOINT);
      // El backend devuelve {success: true, data: [...], total: X}
      // Extraer solo el array de sucursales
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      throw error;
    }
  },

  // GET /api/sucursales/:id - Obtener sucursal por ID
  getById: async (id) => {
    try {
      const response = await api.get(`${SUCURSALES_ENDPOINT}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error al obtener sucursal ${id}:`, error);
      throw error;
    }
  },

  // POST /api/sucursales - Crear nueva sucursal
  create: async (sucursalData) => {
    try {
      const response = await api.post(SUCURSALES_ENDPOINT, sucursalData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear sucursal:', error);
      throw error;
    }
  },

  // PUT /api/sucursales/:id - Actualizar sucursal
  update: async (id, sucursalData) => {
    try {
      const response = await api.put(`${SUCURSALES_ENDPOINT}/${id}`, sucursalData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error al actualizar sucursal ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/sucursales/:id - Desactivar sucursal (soft delete)
  deactivate: async (id) => {
    try {
      const response = await api.delete(`${SUCURSALES_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar sucursal ${id}:`, error);
      throw error;
    }
  },

  // PATCH /api/sucursales/:id/reactivar - Reactivar sucursal
  reactivate: async (id) => {
    try {
      const response = await api.patch(`${SUCURSALES_ENDPOINT}/${id}/reactivar`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error al reactivar sucursal ${id}:`, error);
      throw error;
    }
  }
};

export default sucursalService;
import api from "./api";
import {
  Asistencia,
  AsistenciaRegistro,
  AsistenciaFiltros,
} from "@/types/gestion-curso";

const BASE_URL = "/asistencias";

export const asistenciaService = {
  // Obtener asistencias con filtros
  async getAll(filtros?: AsistenciaFiltros): Promise {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  // Obtener asistencia por ID
  async getById(id: number): Promise {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Registrar asistencia individual
  async create(data: AsistenciaRegistro): Promise {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Registrar asistencias masivas (grupo completo)
  async createBulk(asistencias: AsistenciaRegistro[]): Promise {
    const response = await api.post(`${BASE_URL}/bulk`, asistencias);
    return response.data;
  },

  // Actualizar asistencia
  async update(id: number, data: Partial): Promise {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar asistencia
  async delete(id: number): Promise {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Obtener resumen de asistencias por alumno
  async getResumenAlumno(alumnoId: number, periodoId?: number) {
    const params = periodoId ? `?periodo_id=${periodoId}` : "";
    const response = await api.get(
      `${BASE_URL}/resumen/alumno/${alumnoId}${params}`
    );
    return response.data;
  },
};

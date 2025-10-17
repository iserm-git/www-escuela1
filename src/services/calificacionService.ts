import api from "./api";
import {
  Calificacion,
  CalificacionRegistro,
  CalificacionFiltros,
  Evaluacion,
} from "@/types/gestion-curso";

const BASE_URL = "/calificaciones";

export const calificacionService = {
  // Obtener calificaciones con filtros
  async getAll(filtros?: CalificacionFiltros): Promise<Calificacion[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  // Obtener calificación por ID
  async getById(id: number): Promise<Calificacion> {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Registrar calificación individual
  async create(data: CalificacionRegistro): Promise<Calificacion> {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Registrar calificaciones masivas (grupo + evaluación)
  async createBulk(
    calificaciones: CalificacionRegistro[]
  ): Promise<Calificacion[]> {
    const response = await api.post(`${BASE_URL}/bulk`, calificaciones);
    return response.data;
  },

  // Actualizar calificación
  async update(
    id: number,
    data: Partial<CalificacionRegistro>
  ): Promise<Calificacion> {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar calificación
  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Obtener kardex de alumno
  async getKardexAlumno(alumnoId: number) {
    const response = await api.get(`${BASE_URL}/kardex/${alumnoId}`);
    return response.data;
  },

  // Obtener evaluaciones disponibles
  async getEvaluaciones(): Promise<Evaluacion[]> {
    const response = await api.get("/evaluaciones");
    return response.data;
  },

  // Obtener calificaciones por grupo y evaluación
  async getByGrupoEvaluacion(
    grupoId: number,
    evaluacionId: number
  ): Promise<Calificacion[]> {
    const response = await api.get(
      `${BASE_URL}/grupo/${grupoId}/evaluacion/${evaluacionId}`
    );
    return response.data;
  },

  // Calcular promedio de alumno
  async getPromedioAlumno(alumnoId: number): Promise<number> {
    const response = await api.get(`${BASE_URL}/promedio/alumno/${alumnoId}`);
    return response.data.promedio;
  },

  // Obtener estadísticas de grupo
  async getEstadisticasGrupo(grupoId: number) {
    const response = await api.get(`${BASE_URL}/estadisticas/grupo/${grupoId}`);
    return response.data;
  },
};

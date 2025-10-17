import api from "./api";
import type {
  ReporteAsistencia,
  EstadisticasAsistencia,
  EstadisticasGrupo,
  RendimientoProfesor,
  HistorialAcademico,
  FiltrosReporte,
} from "@/types/reportes.types";

export const reportesService = {
  // Asistencias
  async getAsistenciasPorGrupo(
    grupoId: number,
    filtros?: FiltrosReporte
  ): Promise<ReporteAsistencia[]> {
    const { data } = await api.get(`/reportes/asistencias/grupo/${grupoId}`, {
      params: filtros,
    });
    return data;
  },

  async getAsistenciasPorAlumno(
    alumnoId: number,
    filtros?: FiltrosReporte
  ): Promise<ReporteAsistencia[]> {
    const { data } = await api.get(`/reportes/asistencias/alumno/${alumnoId}`, {
      params: filtros,
    });
    return data;
  },

  async getEstadisticasAsistencia(
    id: number,
    tipo: "grupo" | "alumno"
  ): Promise<EstadisticasAsistencia> {
    const { data } = await api.get(
      `/reportes/asistencias/estadisticas/${tipo}/${id}`
    );
    return data;
  },

  // Grupos
  async getEstadisticasGrupos(
    filtros?: FiltrosReporte
  ): Promise<EstadisticasGrupo[]> {
    const { data } = await api.get("/reportes/grupos", { params: filtros });
    return data;
  },

  async getEstadisticasGrupo(grupoId: number): Promise<EstadisticasGrupo> {
    const { data } = await api.get(`/reportes/grupos/${grupoId}`);
    return data;
  },

  // Profesores
  async getRendimientoProfesores(
    filtros?: FiltrosReporte
  ): Promise<RendimientoProfesor[]> {
    const { data } = await api.get("/reportes/profesores", { params: filtros });
    return data;
  },

  async getRendimientoProfesor(
    profesorId: number,
    filtros?: FiltrosReporte
  ): Promise<RendimientoProfesor> {
    const { data } = await api.get(`/reportes/profesores/${profesorId}`, {
      params: filtros,
    });
    return data;
  },

  // Alumnos
  async getHistorialAcademico(alumnoId: number): Promise<HistorialAcademico[]> {
    const { data } = await api.get(`/reportes/alumnos/${alumnoId}/historial`);
    return data;
  },

  // Exportación
  async exportarPDF(
    tipo: string,
    id: number,
    filtros?: FiltrosReporte
  ): Promise<Blob> {
    const { data } = await api.get(`/reportes/exportar/pdf/${tipo}/${id}`, {
      params: filtros,
      responseType: "blob",
    });
    return data;
  },

  async exportarExcel(
    tipo: string,
    id: number,
    filtros?: FiltrosReporte
  ): Promise<Blob> {
    const { data } = await api.get(`/reportes/exportar/excel/${tipo}/${id}`, {
      params: filtros,
      responseType: "blob",
    });
    return data;
  },
};

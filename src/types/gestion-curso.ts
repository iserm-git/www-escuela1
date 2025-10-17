export type EstadoAsistencia =
  | "presente"
  | "ausente"
  | "retardo"
  | "justificado";

export interface Asistencia {
  id: number;
  alumno_id: number;
  alumno_nombre?: string;
  carga_id: number;
  grupo_nombre?: string;
  materia_nombre?: string;
  profesor_nombre?: string;
  fecha: string; // formato ISO: "YYYY-MM-DD"
  estado: EstadoAsistencia;
  observaciones?: string;
}

export interface AsistenciaRegistro {
  alumno_id: number;
  carga_id: number;
  fecha: string;
  estado: EstadoAsistencia;
  observaciones?: string;
}

export interface AsistenciaFiltros {
  grupo_id?: number;
  materia_id?: number;
  profesor_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: EstadoAsistencia;
}

// ============================================
// TIPOS PARA CALIFICACIONES
// ============================================

export interface Calificacion {
  id: number;
  alumno_id: number;
  alumno_nombre?: string;
  carga_id: number;
  grupo_nombre?: string;
  materia_nombre?: string;
  evaluacion_id: number;
  evaluacion_nombre?: string;
  calificacion: number; // 0-10
  capturada_por?: number;
  capturada_en?: string;
}

export interface CalificacionRegistro {
  alumno_id: number;
  carga_id: number;
  evaluacion_id: number;
  calificacion: number;
}

export interface CalificacionFiltros {
  grupo_id?: number;
  materia_id?: number;
  evaluacion_id?: number;
  alumno_id?: number;
  limit?: number;
  offset?: number;
}

export interface Evaluacion {
  id: number;
  clave: string;
  nombre: string;
  ponderacion: number; // porcentaje
}

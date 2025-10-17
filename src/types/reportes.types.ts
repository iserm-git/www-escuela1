export interface ReporteAsistencia {
  alumnoId: number;
  alumnoNombre: string;
  grupoId: number;
  grupoNombre: string;
  fecha: string;
  estado: "presente" | "ausente" | "retardo" | "justificado";
  observaciones?: string;
}

export interface EstadisticasAsistencia {
  totalClases: number;
  presentes: number;
  ausentes: number;
  retardos: number;
  justificados: number;
  porcentajeAsistencia: number;
}

export interface EstadisticasGrupo {
  grupoId: number;
  grupoNombre: string;
  materiaId: number;
  materiaNombre: string;
  promedioGeneral: number;
  totalAlumnos: number;
  aprobados: number;
  reprobados: number;
  tasaAprobacion: number;
}

export interface RendimientoProfesor {
  profesorId: number;
  profesorNombre: string;
  grupos: EstadisticasGrupo[];
  promedioGlobal: number;
  totalGrupos: number;
  tasaAprobacionPromedio: number;
}

export interface HistorialAcademico {
  periodoId: number;
  periodoClave: string;
  materias: CalificacionPeriodo[];
  promedioSemestre: number;
  creditosObtenidos: number;
}

export interface CalificacionPeriodo {
  materiaId: number;
  materiaNombre: string;
  calificacion: number;
  creditos: number;
  profesorNombre: string;
  estado: "aprobada" | "reprobada" | "cursando";
}

export interface FiltrosReporte {
  periodoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  grupoId?: number;
  materiaId?: number;
  carreraId?: number;
}

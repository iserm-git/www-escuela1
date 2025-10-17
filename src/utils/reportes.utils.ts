import type {
  ReporteAsistencia,
  EstadisticasAsistencia,
  HistorialAcademico,
} from "@/types/reportes.types";

export function calcularEstadisticasAsistencia(
  asistencias: ReporteAsistencia[]
): EstadisticasAsistencia {
  const totalClases = asistencias.length;
  const presentes = asistencias.filter((a) => a.estado === "presente").length;
  const ausentes = asistencias.filter((a) => a.estado === "ausente").length;
  const retardos = asistencias.filter((a) => a.estado === "retardo").length;
  const justificados = asistencias.filter(
    (a) => a.estado === "justificado"
  ).length;

  const porcentajeAsistencia =
    totalClases > 0 ? Math.round((presentes / totalClases) * 100) : 0;

  return {
    totalClases,
    presentes,
    ausentes,
    retardos,
    justificados,
    porcentajeAsistencia,
  };
}

export function calcularPromedioGeneral(
  historial: HistorialAcademico[]
): number {
  let sumaCalificaciones = 0;
  let totalMaterias = 0;

  historial.forEach((periodo) => {
    periodo.materias.forEach((materia) => {
      if (materia.estado !== "cursando") {
        sumaCalificaciones += materia.calificacion;
        totalMaterias++;
      }
    });
  });

  return totalMaterias > 0
    ? Math.round((sumaCalificaciones / totalMaterias) * 100) / 100
    : 0;
}

export function calcularCreditosAcumulados(
  historial: HistorialAcademico[]
): number {
  return historial.reduce((total, periodo) => {
    const creditosPeriodo = periodo.materias
      .filter((m) => m.estado === "aprobada")
      .reduce((sum, m) => sum + m.creditos, 0);
    return total + creditosPeriodo;
  }, 0);
}

export function obtenerTendenciaAsistencia(
  asistencias: ReporteAsistencia[]
): "up" | "down" | "flat" {
  if (asistencias.length < 2) return "flat";

  const mitad = Math.floor(asistencias.length / 2);
  const primerasMitad = asistencias.slice(0, mitad);
  const segundaMitad = asistencias.slice(mitad);

  const porcentajePrimera = calcularPorcentaje(primerasMitad);
  const porcentajeSegunda = calcularPorcentaje(segundaMitad);

  const diferencia = porcentajeSegunda - porcentajePrimera;

  if (diferencia > 5) return "up";
  if (diferencia < -5) return "down";
  return "flat";
}

function calcularPorcentaje(asistencias: ReporteAsistencia[]): number {
  const presentes = asistencias.filter((a) => a.estado === "presente").length;
  return asistencias.length > 0 ? (presentes / asistencias.length) * 100 : 0;
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function obtenerColorCalificacion(calificacion: number): string {
  if (calificacion >= 9) return "success";
  if (calificacion >= 7) return "info";
  if (calificacion >= 6) return "warning";
  return "error";
}

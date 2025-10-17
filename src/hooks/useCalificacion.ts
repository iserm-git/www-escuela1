import { useState, useEffect } from "react";
import { calificacionService } from "@/services/calificacionService";
import type {
  Calificacion,
  CalificacionFiltros,
  Evaluacion,
} from "@/types/gestion-curso";

export function useCalificacion(filtrosIniciales?: CalificacionFiltros) {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<CalificacionFiltros>(
    filtrosIniciales || {}
  );

  useEffect(() => {
    loadCalificaciones();
    loadEvaluaciones();
  }, [filtros]);

  const loadCalificaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calificacionService.getAll(filtros);
      setCalificaciones(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar calificaciones"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadEvaluaciones = async () => {
    try {
      const data = await calificacionService.getEvaluaciones();
      setEvaluaciones(data);
    } catch (err) {
      console.error("Error al cargar evaluaciones:", err);
    }
  };

  const createCalificacion = async (calificacion: Omit<Calificacion, "id">) => {
    try {
      setLoading(true);
      const nueva = await calificacionService.create(calificacion);
      setCalificaciones([nueva, ...calificaciones]);
      return { success: true, data: nueva };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear calificación"
      );
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateCalificacion = async (
    id: number,
    data: Partial<Calificacion>
  ) => {
    try {
      setLoading(true);
      const updated = await calificacionService.update(id, data);
      setCalificaciones(calificaciones.map((c) => (c.id === id ? updated : c)));
      return { success: true, data: updated };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar calificación"
      );
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteCalificacion = async (id: number) => {
    try {
      setLoading(true);
      await calificacionService.delete(id);
      setCalificaciones(calificaciones.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar calificación"
      );
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const getPromedioAlumno = (alumnoId: number): number => {
    const califs = calificaciones.filter((c) => c.alumno_id === alumnoId);
    if (califs.length === 0) return 0;
    const suma = califs.reduce((acc, c) => acc + c.calificacion, 0);
    return Number((suma / califs.length).toFixed(2));
  };

  const refresh = () => loadCalificaciones();

  return {
    calificaciones,
    evaluaciones,
    loading,
    error,
    filtros,
    setFiltros,
    createCalificacion,
    updateCalificacion,
    deleteCalificacion,
    getPromedioAlumno,
    refresh,
  };
}

import { useState, useEffect } from "react";
import { asistenciaService } from "@/services/asistenciaService";
import type { Asistencia, AsistenciaFiltros } from "@/types/gestion-curso";

export function useAsistencia(filtrosIniciales?: AsistenciaFiltros) {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<AsistenciaFiltros>(
    filtrosIniciales || {}
  );

  useEffect(() => {
    loadAsistencias();
  }, [filtros]);

  const loadAsistencias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await asistenciaService.getAll(filtros);
      setAsistencias(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar asistencias"
      );
    } finally {
      setLoading(false);
    }
  };

  const createAsistencia = async (asistencia: Omit<Asistencia, "id">) => {
    try {
      setLoading(true);
      const nueva = await asistenciaService.create(asistencia);
      setAsistencias([nueva, ...asistencias]);
      return { success: true, data: nueva };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear asistencia"
      );
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateAsistencia = async (id: number, data: Partial<Asistencia>) => {
    try {
      setLoading(true);
      const updated = await asistenciaService.update(id, data);
      setAsistencias(asistencias.map((a) => (a.id === id ? updated : a)));
      return { success: true, data: updated };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar asistencia"
      );
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteAsistencia = async (id: number) => {
    try {
      setLoading(true);
      await asistenciaService.delete(id);
      setAsistencias(asistencias.filter((a) => a.id !== id));
      return { success: true };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar asistencia"
      );
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => loadAsistencias();

  return {
    asistencias,
    loading,
    error,
    filtros,
    setFiltros,
    createAsistencia,
    updateAsistencia,
    deleteAsistencia,
    refresh,
  };
}

"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import type { Asistencia, EstadoAsistencia } from "@/types/gestion-curso";

interface AsistenciaDialogProps {
  open: boolean;
  initial?: Asistencia | null;
  onClose: () => void;
  onSave: (asistencia: Asistencia) => void;
}

export default function AsistenciaDialog({
  open,
  initial,
  onClose,
  onSave,
}: AsistenciaDialogProps) {
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState<EstadoAsistencia>("presente");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (initial) {
      setFecha(initial.fecha);
      setEstado(initial.estado);
      setObservaciones(initial.observaciones || "");
    } else {
      // Valores por defecto para nuevo registro
      setFecha(new Date().toISOString().split("T")[0]);
      setEstado("presente");
      setObservaciones("");
    }
  }, [initial]);

  const handleSave = () => {
    if (!fecha || !estado) return;

    const asistencia: Asistencia = {
      id: initial?.id || 0,
      alumno_id: initial?.alumno_id || 0,
      carga_id: initial?.carga_id || 0,
      fecha,
      estado,
      observaciones: observaciones.trim() || undefined,
    };

    onSave(asistencia);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial?.id ? "Editar Asistencia" : "Nueva Asistencia"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {initial?.alumno_nombre && (
            <TextField
              label="Alumno"
              value={initial.alumno_nombre}
              disabled
              fullWidth
            />
          )}

          <TextField
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
            fullWidth
            required
          />

          <FormControl fullWidth required>
            <InputLabel>Estado</InputLabel>
            <Select
              value={estado}
              label="Estado"
              onChange={(e) => setEstado(e.target.value as EstadoAsistencia)}
            >
              <MenuItem value="presente">✅ Presente</MenuItem>
              <MenuItem value="ausente">❌ Ausente</MenuItem>
              <MenuItem value="retardo">⏰ Retardo</MenuItem>
              <MenuItem value="justificado">📋 Justificado</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            multiline
            rows={3}
            placeholder="Agregar comentarios opcionales..."
            fullWidth
            inputProps={{ maxLength: 500 }}
            helperText={`${observaciones.length}/500 caracteres`}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!fecha || !estado}
        >
          {initial?.id ? "Actualizar" : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

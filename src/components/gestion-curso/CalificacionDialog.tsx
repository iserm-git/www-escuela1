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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import type { Calificacion, Evaluacion } from "@/types/gestion-curso";

interface CalificacionDialogProps {
  open: boolean;
  initial?: Calificacion | null;
  evaluaciones: Evaluacion[];
  onClose: () => void;
  onSave: (calificacion: Calificacion) => void;
}

export default function CalificacionDialog({
  open,
  initial,
  evaluaciones,
  onClose,
  onSave,
}: CalificacionDialogProps) {
  const [evaluacionId, setEvaluacionId] = useState<number>(0);
  const [calificacion, setCalificacion] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setEvaluacionId(initial.evaluacion_id);
      setCalificacion(initial.calificacion.toString());
    } else {
      setEvaluacionId(0);
      setCalificacion("");
    }
    setError("");
  }, [initial, open]);

  const validateCalificacion = (value: string): boolean => {
    const num = parseFloat(value);

    if (isNaN(num)) {
      setError("Ingresa un número válido");
      return false;
    }

    if (num < 0 || num > 10) {
      setError("La calificación debe estar entre 0 y 10");
      return false;
    }

    // Verificar máximo 1 decimal
    if ((num * 10) % 1 !== 0) {
      setError("La calificación solo puede tener 1 decimal (ej: 8.5)");
      return false;
    }

    setError("");
    return true;
  };

  const handleCalificacionChange = (value: string) => {
    setCalificacion(value);
    if (value) {
      validateCalificacion(value);
    } else {
      setError("");
    }
  };

  const handleSave = () => {
    if (!evaluacionId) {
      setError("Selecciona una evaluación");
      return;
    }

    if (!calificacion || !validateCalificacion(calificacion)) {
      return;
    }

    const cal: Calificacion = {
      id: initial?.id || 0,
      alumno_id: initial?.alumno_id || 0,
      carga_id: initial?.carga_id || 0,
      evaluacion_id: evaluacionId,
      calificacion: parseFloat(calificacion),
    };

    onSave(cal);
  };

  const getCalificacionColor = (value: number) => {
    if (value < 6) return "error.main";
    if (value < 8) return "warning.main";
    return "success.main";
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial?.id ? "Editar Calificación" : "Nueva Calificación"}
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

          <FormControl fullWidth required disabled={!!initial?.id}>
            <InputLabel>Evaluación</InputLabel>
            <Select
              value={evaluacionId}
              label="Evaluación"
              onChange={(e) => setEvaluacionId(Number(e.target.value))}
            >
              <MenuItem value={0}>Selecciona una evaluación</MenuItem>
              {evaluaciones.map((evaluacion) => (
                <MenuItem key={evaluacion.id} value={evaluacion.id}>
                  {evaluacion.nombre} ({evaluacion.ponderacion}%)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Calificación"
            type="number"
            value={calificacion}
            onChange={(e) => handleCalificacionChange(e.target.value)}
            fullWidth
            required
            error={!!error}
            helperText={error || "Rango válido: 0.0 - 10.0"}
            inputProps={{
              min: 0,
              max: 10,
              step: 0.1,
            }}
            InputProps={{
              endAdornment: calificacion && !error && (
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: getCalificacionColor(parseFloat(calificacion)) }}
                >
                  {parseFloat(calificacion).toFixed(1)}
                </Typography>
              ),
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}

          {!error && calificacion && (
            <Alert severity="info">
              {parseFloat(calificacion) >= 6 ? (
                <strong>✅ Aprobado</strong>
              ) : (
                <strong>❌ Reprobado</strong>
              )}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!evaluacionId || !calificacion || !!error}
        >
          {initial?.id ? "Actualizar" : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

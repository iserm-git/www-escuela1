// ========================================
// src/components/gestion-curso/AsistenciaDialog.tsx
// ========================================

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

// ========================================
// app/gestion-curso/asistencia/registrar/page.tsx
// Registro Masivo de Asistencias
// ========================================

"use client";

import { useState, useEffect } from "react";
import Protected from "@/components/Protected";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  CheckCircle as PresenteIcon,
  Cancel as AusenteIcon,
  Schedule as RetardoIcon,
  Assignment as JustificadoIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { asistenciaService } from "@/services/asistenciaService";
import type { EstadoAsistencia, AsistenciaRegistro } from "@/types/gestion-curso";

interface AlumnoAsistencia {
  alumno_id: number;
  alumno_nombre: string;
  estado: EstadoAsistencia;
  observaciones: string;
}

export default function RegistrarAsistenciaPage() {
  const router = useRouter();

  // Estados del formulario
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [grupoId, setGrupoId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [cargaId, setCargaId] = useState<number | null>(null);

  // Lista de alumnos con estados
  const [alumnos, setAlumnos] = useState<AlumnoAsistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  // Opciones para select (en producción vienen de la API)
  const grupos = [
    { id: 1, nombre: "1A" },
    { id: 2, nombre: "2B" },
  ];

  const materias = [
    { id: 1, nombre: "Lenguajes Web" },
    { id: 2, nombre: "Bases de Datos" },
  ];

  // Cargar alumnos del grupo cuando se seleccione
  useEffect(() => {
    if (grupoId && materiaId) {
      loadAlumnos();
    }
  }, [grupoId, materiaId]);

  const loadAlumnos = async () => {
    try {
      setLoading(true);
      // En producción: GET /grupos/{grupoId}/alumnos
      // Simulación:
      const alumnosMock: AlumnoAsistencia[] = [
        { alumno_id: 1, alumno_nombre: "Juan Pérez López", estado: "presente", observaciones: "" },
        { alumno_id: 2, alumno_nombre: "María García Ruiz", estado: "presente", observaciones: "" },
        { alumno_id: 3, alumno_nombre: "Carlos Hernández Silva", estado: "presente", observaciones: "" },
      ];
      
      setAlumnos(alumnosMock);
      // Obtener carga_id (grupo + materia + profesor)
      setCargaId(123); // Mock
    } catch (error) {
      showSnackbar("Error al cargar alumnos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = (alumnoId: number, estado: EstadoAsistencia) => {
    setAlumnos(
      alumnos.map((alumno) =>
        alumno.alumno_id === alumnoId ? { ...alumno, estado } : alumno
      )
    );
  };

  const handleObservacionChange = (alumnoId: number, observaciones: string) => {
    setAlumnos(
      alumnos.map((alumno) =>
        alumno.alumno_id === alumnoId ? { ...alumno, observaciones } : alumno
      )
    );
  };

  const handleMarcarTodos = (estado: EstadoAsistencia) => {
    setAlumnos(alumnos.map((alumno) => ({ ...alumno, estado })));
  };

  const handleSaveAll = async () => {
    if (!cargaId) return;

    try {
      setSaving(true);
      const registros: AsistenciaRegistro[] = alumnos.map((alumno) => ({
        alumno_id: alumno.alumno_id,
        carga_id: cargaId,
        fecha,
        estado: alumno.estado,
        observaciones: alumno.observaciones.trim() || undefined,
      }));

      await asistenciaService.createBulk(registros);
      showSnackbar(
        `✅ Asistencia registrada correctamente para ${alumnos.length} alumnos`,
        "success"
      );
      
      // Redirigir después de 2 segundos
      setTimeout(() => router.push("/gestion-curso/asistencia"), 2000);
    } catch (error) {
      showSnackbar("Error al guardar asistencias", "error");
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error" | "info") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Protected>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.back()}
            variant="outlined"
          >
            Volver
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Registro de Asistencia
          </Typography>
        </Stack>

        {/* Formulario de selección */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            1. Selecciona el grupo y la materia
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <TextField
              select
              label="Grupo"
              value={grupoId}
              onChange={(e) => setGrupoId(e.target.value)}
              sx={{ minWidth: 200 }}
              required
            >
              {grupos.map((grupo) => (
                <MenuItem key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Materia"
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
              sx={{ minWidth: 300 }}
              required
            >
              {materias.map((materia) => (
                <MenuItem key={materia.id} value={materia.id}>
                  {materia.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
              sx={{ minWidth: 200 }}
              required
            />
          </Stack>
        </Paper>

        {/* Tabla de asistencias */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : alumnos.length > 0 ? (
          <Paper>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  2. Marca la asistencia de cada alumno ({alumnos.length} alumnos)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<PresenteIcon />}
                    onClick={() => handleMarcarTodos("presente")}
                  >
                    Todos presentes
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<AusenteIcon />}
                    onClick={() => handleMarcarTodos("ausente")}
                  >
                    Todos ausentes
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Divider />

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell width="40%"><strong>Alumno</strong></TableCell>
                    <TableCell width="30%"><strong>Estado</strong></TableCell>
                    <TableCell width="30%"><strong>Observaciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnos.map((alumno) => (
                    <TableRow key={alumno.alumno_id} hover>
                      <TableCell>{alumno.alumno_nombre}</TableCell>
                      <TableCell>
                        <ToggleButtonGroup
                          value={alumno.estado}
                          exclusive
                          onChange={(_, value) => {
                            if (value) handleEstadoChange(alumno.alumno_id, value);
                          }}
                          size="small"
                        >
                          <ToggleButton value="presente" color="success">
                            <PresenteIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Presente
                          </ToggleButton>
                          <ToggleButton value="ausente" color="error">
                            <AusenteIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Ausente
                          </ToggleButton>
                          <ToggleButton value="retardo" color="warning">
                            <RetardoIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Retardo
                          </ToggleButton>
                          <ToggleButton value="justificado" color="info">
                            <JustificadoIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Justificado
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="Comentarios opcionales..."
                          value={alumno.observaciones}
                          onChange={(e) =>
                            handleObservacionChange(alumno.alumno_id, e.target.value)
                          }
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider />

            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSaveAll}
                disabled={saving || alumnos.length === 0}
              >
                {saving ? "Guardando..." : "Guardar Asistencia"}
              </Button>
            </Box>
          </Paper>
        ) : (
          grupoId && materiaId && (
            <Paper sx={{ p: 5, textAlign: "center" }}>
              <Typography color="text.secondary">
                No hay alumnos inscritos en este grupo
              </Typography>
            </Paper>
          )
        )}

        {/* Notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Protected>
  );
}
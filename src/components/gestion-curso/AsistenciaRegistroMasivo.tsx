"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  CheckCircle as PresenteIcon,
  Cancel as AusenteIcon,
  Schedule as RetardoIcon,
  Assignment as JustificadoIcon,
  Group as GroupIcon,
  MenuBook as MenuBookIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import type {
  EstadoAsistencia,
  AsistenciaRegistro,
} from "@/types/gestion-curso";

interface AlumnoAsistencia {
  alumno_id: number;
  alumno_nombre: string;
  estado: EstadoAsistencia;
  observaciones: string;
}

interface AsistenciaRegistroMasivoProps {
  onSave: (registros: AsistenciaRegistro[]) => Promise<void>;
  onCancel?: () => void;
  grupos?: Array<{ id: number; nombre: string }>;
  materias?: Array<{ id: number; nombre: string }>;
  defaultGrupoId?: number;
  defaultMateriaId?: number;
  defaultFecha?: string;
}

export default function AsistenciaRegistroMasivo({
  onSave,
  onCancel,
  grupos = [],
  materias = [],
  defaultGrupoId,
  defaultMateriaId,
  defaultFecha,
}: AsistenciaRegistroMasivoProps) {
  // Estados del formulario
  const [fecha, setFecha] = useState(
    defaultFecha || new Date().toISOString().split("T")[0]
  );
  const [grupoId, setGrupoId] = useState(defaultGrupoId?.toString() || "");
  const [materiaId, setMateriaId] = useState(
    defaultMateriaId?.toString() || ""
  );
  const [cargaId, setCargaId] = useState<number | null>(null);

  // Lista de alumnos con estados
  const [alumnos, setAlumnos] = useState<AlumnoAsistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estadísticas en tiempo real
  const [stats, setStats] = useState({
    presentes: 0,
    ausentes: 0,
    retardos: 0,
    justificados: 0,
  });

  // Cargar alumnos cuando se seleccione grupo y materia
  useEffect(() => {
    if (grupoId && materiaId) {
      loadAlumnos();
    }
  }, [grupoId, materiaId]);

  // Calcular estadísticas cuando cambien los estados
  useEffect(() => {
    calculateStats();
  }, [alumnos]);

  const loadAlumnos = async () => {
    try {
      setLoading(true);

      // En producción: GET /grupos/{grupoId}/alumnos
      // Mock de datos:
      const alumnosMock: AlumnoAsistencia[] = [
        {
          alumno_id: 1,
          alumno_nombre: "Juan Pérez López",
          estado: "presente",
          observaciones: "",
        },
        {
          alumno_id: 2,
          alumno_nombre: "María García Ruiz",
          estado: "presente",
          observaciones: "",
        },
        {
          alumno_id: 3,
          alumno_nombre: "Carlos Hernández Silva",
          estado: "presente",
          observaciones: "",
        },
        {
          alumno_id: 4,
          alumno_nombre: "Ana Martínez Torres",
          estado: "presente",
          observaciones: "",
        },
        {
          alumno_id: 5,
          alumno_nombre: "Luis Rodríguez Flores",
          estado: "presente",
          observaciones: "",
        },
        {
          alumno_id: 6,
          alumno_nombre: "Laura Sánchez Morales",
          estado: "presente",
          observaciones: "",
        },
        {
          alumno_id: 7,
          alumno_nombre: "Pedro González Ramírez",
          estado: "presente",
          observaciones: "",
        },
        {
          alumno_id: 8,
          alumno_nombre: "Sofia Díaz López",
          estado: "presente",
          observaciones: "",
        },
      ];

      setAlumnos(alumnosMock);
      setCargaId(123); // Mock - obtener de API
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
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

  const calculateStats = () => {
    const stats = {
      presentes: alumnos.filter((a) => a.estado === "presente").length,
      ausentes: alumnos.filter((a) => a.estado === "ausente").length,
      retardos: alumnos.filter((a) => a.estado === "retardo").length,
      justificados: alumnos.filter((a) => a.estado === "justificado").length,
    };
    setStats(stats);
  };

  const handleSaveAll = async () => {
    if (!cargaId) {
      return;
    }

    try {
      setSaving(true);

      const registros: AsistenciaRegistro[] = alumnos.map((alumno) => ({
        alumno_id: alumno.alumno_id,
        carga_id: cargaId,
        fecha,
        estado: alumno.estado,
        observaciones: alumno.observaciones.trim() || undefined,
      }));

      await onSave(registros);
    } catch (error) {
      console.error("Error al guardar asistencias:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const getEstadoIcon = (estado: EstadoAsistencia) => {
    const icons = {
      presente: <PresenteIcon fontSize="small" />,
      ausente: <AusenteIcon fontSize="small" />,
      retardo: <RetardoIcon fontSize="small" />,
      justificado: <JustificadoIcon fontSize="small" />,
    };
    return icons[estado];
  };

  const getEstadoColor = (estado: EstadoAsistencia) => {
    const colors = {
      presente: "success",
      ausente: "error",
      retardo: "warning",
      justificado: "info",
    };
    return colors[estado];
  };

  const getGrupoNombre = () => {
    const grupo = grupos.find((g) => g.id === Number(grupoId));
    return grupo ? grupo.nombre : "";
  };

  const getMateriaNombre = () => {
    const materia = materias.find((m) => m.id === Number(materiaId));
    return materia ? materia.nombre : "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box>
      {/* Selección de Contexto */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selecciona el grupo, materia y fecha
        </Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Grupo"
              value={grupoId}
              onChange={(e) => setGrupoId(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Selecciona un grupo</MenuItem>
              {grupos.map((grupo) => (
                <MenuItem key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Materia"
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Selecciona una materia</MenuItem>
              {materias.map((materia) => (
                <MenuItem key={materia.id} value={materia.id}>
                  {materia.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
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
          </Grid>
        </Grid>
      </Paper>

      {/* Estadísticas en Tiempo Real */}
      {alumnos.length > 0 && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PresenteIcon color="success" />
                    <Typography variant="body2" color="text.secondary">
                      Presentes
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color="success.main"
                  >
                    {stats.presentes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alumnos.length > 0
                      ? `${((stats.presentes / alumnos.length) * 100).toFixed(
                          0
                        )}%`
                      : "0%"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AusenteIcon color="error" />
                    <Typography variant="body2" color="text.secondary">
                      Ausentes
                    </Typography>
                  </Stack>
                  <Typography variant="h3" fontWeight={700} color="error.main">
                    {stats.ausentes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alumnos.length > 0
                      ? `${((stats.ausentes / alumnos.length) * 100).toFixed(
                          0
                        )}%`
                      : "0%"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <RetardoIcon color="warning" />
                    <Typography variant="body2" color="text.secondary">
                      Retardos
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color="warning.main"
                  >
                    {stats.retardos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alumnos.length > 0
                      ? `${((stats.retardos / alumnos.length) * 100).toFixed(
                          0
                        )}%`
                      : "0%"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <JustificadoIcon color="info" />
                    <Typography variant="body2" color="text.secondary">
                      Justificados
                    </Typography>
                  </Stack>
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    {stats.justificados}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alumnos.length > 0
                      ? `${(
                          (stats.justificados / alumnos.length) *
                          100
                        ).toFixed(0)}%`
                      : "0%"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabla de Registro */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : alumnos.length > 0 ? (
        <Paper>
          <Box sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight={600}>
                  Marca la asistencia de cada alumno
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Chip
                    icon={<GroupIcon fontSize="small" />}
                    label={getGrupoNombre()}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<MenuBookIcon fontSize="small" />}
                    label={getMateriaNombre()}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<CalendarIcon fontSize="small" />}
                    label={formatDate(fecha)}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Tooltip title="Marcar todos presente">
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<PresenteIcon />}
                    onClick={() => handleMarcarTodos("presente")}
                  >
                    Todos Presentes
                  </Button>
                </Tooltip>
                <Tooltip title="Marcar todos ausente">
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<AusenteIcon />}
                    onClick={() => handleMarcarTodos("ausente")}
                  >
                    Todos Ausentes
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="5%">
                    <strong>#</strong>
                  </TableCell>
                  <TableCell width="30%">
                    <strong>Alumno</strong>
                  </TableCell>
                  <TableCell width="35%">
                    <strong>Estado</strong>
                  </TableCell>
                  <TableCell width="30%">
                    <strong>Observaciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnos.map((alumno, index) => (
                  <TableRow key={alumno.alumno_id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {alumno.alumno_nombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <ToggleButtonGroup
                        value={alumno.estado}
                        exclusive
                        onChange={(_, value) => {
                          if (value)
                            handleEstadoChange(alumno.alumno_id, value);
                        }}
                        size="small"
                      >
                        <ToggleButton value="presente" color="success">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <PresenteIcon fontSize="small" />
                            <span>Presente</span>
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="ausente" color="error">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <AusenteIcon fontSize="small" />
                            <span>Ausente</span>
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="retardo" color="warning">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <RetardoIcon fontSize="small" />
                            <span>Retardo</span>
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="justificado" color="info">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <JustificadoIcon fontSize="small" />
                            <span>Justificado</span>
                          </Stack>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="Comentarios opcionales..."
                        value={alumno.observaciones}
                        onChange={(e) =>
                          handleObservacionChange(
                            alumno.alumno_id,
                            e.target.value
                          )
                        }
                        fullWidth
                        multiline
                        maxRows={2}
                        inputProps={{ maxLength: 200 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Alert severity="info" sx={{ flex: 1 }}>
                Se registrará la asistencia de {alumnos.length} alumnos para el{" "}
                {formatDate(fecha)}
              </Alert>
              <Stack direction="row" spacing={1}>
                {onCancel && (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    saving ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                  onClick={handleSaveAll}
                  disabled={saving || alumnos.length === 0}
                >
                  {saving ? "Guardando..." : "Guardar Asistencia"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      ) : (
        grupoId &&
        materiaId && (
          <Paper sx={{ p: 5, textAlign: "center" }}>
            <Typography color="text.secondary">
              No hay alumnos inscritos en este grupo
            </Typography>
          </Paper>
        )
      )}
    </Box>
  );
}

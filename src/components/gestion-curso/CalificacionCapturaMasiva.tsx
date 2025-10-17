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
  Typography,
  Alert,
  Chip,
  Tooltip,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Group as GroupIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import type { CalificacionRegistro, Evaluacion } from "@/types/gestion-curso";

interface AlumnoCalificacion {
  alumno_id: number;
  alumno_nombre: string;
  calificacion: string;
  error: string;
}

interface CalificacionCapturaMasivaProps {
  onSave: (registros: CalificacionRegistro[]) => Promise<void>;
  onCancel?: () => void;
  grupos?: Array<{ id: number; nombre: string }>;
  materias?: Array<{ id: number; nombre: string }>;
  evaluaciones?: Evaluacion[];
  defaultGrupoId?: number;
  defaultMateriaId?: number;
  defaultEvaluacionId?: number;
  allowPartialSave?: boolean; // Permitir guardar solo algunas calificaciones
}

export default function CalificacionCapturaMasiva({
  onSave,
  onCancel,
  grupos = [],
  materias = [],
  evaluaciones = [],
  defaultGrupoId,
  defaultMateriaId,
  defaultEvaluacionId,
  allowPartialSave = true,
}: CalificacionCapturaMasivaProps) {
  // Estados del formulario
  const [grupoId, setGrupoId] = useState(defaultGrupoId?.toString() || "");
  const [materiaId, setMateriaId] = useState(
    defaultMateriaId?.toString() || ""
  );
  const [evaluacionId, setEvaluacionId] = useState(
    defaultEvaluacionId?.toString() || ""
  );
  const [cargaId, setCargaId] = useState<number | null>(null);

  // Lista de alumnos con calificaciones
  const [alumnos, setAlumnos] = useState<AlumnoCalificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estadísticas en tiempo real
  const [stats, setStats] = useState({
    promedio: 0,
    aprobados: 0,
    reprobados: 0,
    sinCapturar: 0,
  });

  // Cargar alumnos cuando se seleccione grupo, materia y evaluación
  useEffect(() => {
    if (grupoId && materiaId && evaluacionId) {
      loadAlumnos();
    }
  }, [grupoId, materiaId, evaluacionId]);

  // Calcular estadísticas cuando cambien las calificaciones
  useEffect(() => {
    calculateStats();
  }, [alumnos]);

  const loadAlumnos = async () => {
    try {
      setLoading(true);

      // En producción: GET /grupos/{grupoId}/alumnos
      // Y GET /calificaciones/grupo/{grupoId}/evaluacion/{evaluacionId}
      // para cargar calificaciones existentes

      // Mock de datos:
      const alumnosMock: AlumnoCalificacion[] = [
        {
          alumno_id: 1,
          alumno_nombre: "Juan Pérez López",
          calificacion: "",
          error: "",
        },
        {
          alumno_id: 2,
          alumno_nombre: "María García Ruiz",
          calificacion: "",
          error: "",
        },
        {
          alumno_id: 3,
          alumno_nombre: "Carlos Hernández Silva",
          calificacion: "",
          error: "",
        },
        {
          alumno_id: 4,
          alumno_nombre: "Ana Martínez Torres",
          calificacion: "",
          error: "",
        },
        {
          alumno_id: 5,
          alumno_nombre: "Luis Rodríguez Flores",
          calificacion: "",
          error: "",
        },
        {
          alumno_id: 6,
          alumno_nombre: "Laura Sánchez Morales",
          calificacion: "",
          error: "",
        },
        {
          alumno_id: 7,
          alumno_nombre: "Pedro González Ramírez",
          calificacion: "",
          error: "",
        },
        {
          alumno_id: 8,
          alumno_nombre: "Sofia Díaz López",
          calificacion: "",
          error: "",
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

  const validateCalificacion = (value: string): string => {
    if (!value) return "";

    const num = parseFloat(value);

    if (isNaN(num)) {
      return "Número inválido";
    }

    if (num < 0 || num > 10) {
      return "Debe estar entre 0 y 10";
    }

    // Verificar máximo 1 decimal
    if ((num * 10) % 1 !== 0) {
      return "Solo 1 decimal permitido";
    }

    return "";
  };

  const handleCalificacionChange = (alumnoId: number, value: string) => {
    const error = validateCalificacion(value);
    setAlumnos(
      alumnos.map((alumno) =>
        alumno.alumno_id === alumnoId
          ? { ...alumno, calificacion: value, error }
          : alumno
      )
    );
  };

  const handleSetAll = (value: string) => {
    const error = validateCalificacion(value);
    if (!error && value) {
      setAlumnos(
        alumnos.map((alumno) => ({
          ...alumno,
          calificacion: value,
          error: "",
        }))
      );
    }
  };

  const handleClearCalificacion = (alumnoId: number) => {
    setAlumnos(
      alumnos.map((alumno) =>
        alumno.alumno_id === alumnoId
          ? { ...alumno, calificacion: "", error: "" }
          : alumno
      )
    );
  };

  const handleClearAll = () => {
    setAlumnos(
      alumnos.map((alumno) => ({
        ...alumno,
        calificacion: "",
        error: "",
      }))
    );
  };

  const calculateStats = () => {
    const validos = alumnos.filter(
      (a) => a.calificacion && !a.error && a.calificacion !== ""
    );

    if (validos.length === 0) {
      setStats({
        promedio: 0,
        aprobados: 0,
        reprobados: 0,
        sinCapturar: alumnos.length,
      });
      return;
    }

    const suma = validos.reduce(
      (acc, alumno) => acc + parseFloat(alumno.calificacion),
      0
    );
    const promedio = Number((suma / validos.length).toFixed(2));
    const aprobados = validos.filter(
      (a) => parseFloat(a.calificacion) >= 6
    ).length;
    const reprobados = validos.filter(
      (a) => parseFloat(a.calificacion) < 6
    ).length;
    const sinCapturar = alumnos.length - validos.length;

    setStats({ promedio, aprobados, reprobados, sinCapturar });
  };

  const handleSaveAll = async () => {
    if (!cargaId) {
      return;
    }

    // Validar que al menos una calificación esté capturada
    const validos = alumnos.filter(
      (a) => a.calificacion && !a.error && a.calificacion !== ""
    );

    if (validos.length === 0) {
      throw new Error("Debes capturar al menos una calificación");
    }

    // Verificar si hay errores
    const conErrores = alumnos.filter((a) => a.error && a.calificacion);
    if (conErrores.length > 0) {
      throw new Error(
        `Hay ${conErrores.length} calificaciones con errores. Corrígelas antes de guardar.`
      );
    }

    // Verificar si hay calificaciones sin capturar
    if (!allowPartialSave && validos.length < alumnos.length) {
      throw new Error(
        `Faltan ${alumnos.length - validos.length} calificaciones por capturar.`
      );
    }

    try {
      setSaving(true);

      const registros: CalificacionRegistro[] = validos.map((alumno) => ({
        alumno_id: alumno.alumno_id,
        carga_id: cargaId,
        evaluacion_id: Number(evaluacionId),
        calificacion: parseFloat(alumno.calificacion),
      }));

      await onSave(registros);
    } catch (error) {
      console.error("Error al guardar calificaciones:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const getCalificacionColor = (value: string) => {
    if (!value) return "text.secondary";
    const num = parseFloat(value);
    if (isNaN(num)) return "text.secondary";
    if (num < 6) return "error.main";
    if (num < 8) return "warning.main";
    return "success.main";
  };

  const getCalificacionIcon = (value: string) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    if (num >= 6) return <CheckIcon fontSize="small" color="success" />;
    return <CancelIcon fontSize="small" color="error" />;
  };

  const getGrupoNombre = () => {
    const grupo = grupos.find((g) => g.id === Number(grupoId));
    return grupo ? grupo.nombre : "";
  };

  const getMateriaNombre = () => {
    const materia = materias.find((m) => m.id === Number(materiaId));
    return materia ? materia.nombre : "";
  };

  const getEvaluacionNombre = () => {
    const evaluacion = evaluaciones.find((e) => e.id === Number(evaluacionId));
    return evaluacion ? evaluacion.nombre : "";
  };

  const getEvaluacionPonderacion = () => {
    const evaluacion = evaluaciones.find((e) => e.id === Number(evaluacionId));
    return evaluacion ? evaluacion.ponderacion : 0;
  };

  return (
    <Box>
      {/* Selección de Contexto */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selecciona el grupo, materia y evaluación
        </Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3}>
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

          <Grid item xs={12} md={5}>
            <TextField
              select
              label="Evaluación"
              value={evaluacionId}
              onChange={(e) => setEvaluacionId(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Selecciona una evaluación</MenuItem>
              {evaluaciones.map((evaluacion) => (
                <MenuItem key={evaluacion.id} value={evaluacion.id}>
                  {evaluacion.nombre} ({evaluacion.ponderacion}%)
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Estadísticas en Tiempo Real */}
      {alumnos.length > 0 && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Promedio del Grupo
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{
                      color: getCalificacionColor(stats.promedio.toString()),
                    }}
                  >
                    {stats.promedio.toFixed(2)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.promedio / 10) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getCalificacionColor(
                          stats.promedio.toString()
                        ),
                      },
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Aprobados
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckIcon color="success" />
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      color="success.main"
                    >
                      {stats.aprobados}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {alumnos.length > 0
                      ? `${((stats.aprobados / alumnos.length) * 100).toFixed(
                          0
                        )}%`
                      : "0%"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Reprobados
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CancelIcon color="error" />
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      color="error.main"
                    >
                      {stats.reprobados}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {alumnos.length > 0
                      ? `${((stats.reprobados / alumnos.length) * 100).toFixed(
                          0
                        )}%`
                      : "0%"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Sin Capturar
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <InfoIcon color="action" />
                    <Typography variant="h3" fontWeight={700}>
                      {stats.sinCapturar}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabla de Captura */}
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
                  Captura las calificaciones
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
                    icon={<AssessmentIcon fontSize="small" />}
                    label={`${getEvaluacionNombre()} (${getEvaluacionPonderacion()}%)`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Tooltip title="Asignar 10 a todos">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSetAll("10")}
                  >
                    Todos 10
                  </Button>
                </Tooltip>
                <Tooltip title="Asignar 8 a todos">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSetAll("8")}
                  >
                    Todos 8
                  </Button>
                </Tooltip>
                <Tooltip title="Asignar 6 a todos">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSetAll("6")}
                  >
                    Todos 6
                  </Button>
                </Tooltip>
                <Tooltip title="Limpiar todas">
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={handleClearAll}
                  >
                    Limpiar Todo
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
                  <TableCell width="45%">
                    <strong>Alumno</strong>
                  </TableCell>
                  <TableCell width="30%">
                    <strong>Calificación (0.0 - 10.0)</strong>
                  </TableCell>
                  <TableCell width="20%" align="center">
                    <strong>Estatus</strong>
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
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                          size="small"
                          type="number"
                          value={alumno.calificacion}
                          onChange={(e) =>
                            handleCalificacionChange(
                              alumno.alumno_id,
                              e.target.value
                            )
                          }
                          error={!!alumno.error}
                          helperText={alumno.error}
                          placeholder="0.0"
                          inputProps={{
                            min: 0,
                            max: 10,
                            step: 0.1,
                          }}
                          sx={{ width: 120 }}
                          InputProps={{
                            endAdornment: getCalificacionIcon(
                              alumno.calificacion
                            ),
                          }}
                        />
                        {alumno.calificacion && (
                          <Tooltip title="Limpiar">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleClearCalificacion(alumno.alumno_id)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      {alumno.calificacion && !alumno.error ? (
                        <Chip
                          label={
                            parseFloat(alumno.calificacion) >= 6
                              ? "Aprobado"
                              : "Reprobado"
                          }
                          color={
                            parseFloat(alumno.calificacion) >= 6
                              ? "success"
                              : "error"
                          }
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Pendiente
                        </Typography>
                      )}
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
                Se guardarán {stats.aprobados + stats.reprobados}{" "}
                calificaciones. Promedio:{" "}
                <strong>{stats.promedio.toFixed(2)}</strong>
                {stats.sinCapturar > 0 && (
                  <>
                    {" "}
                    • Pendientes: <strong>{stats.sinCapturar}</strong>
                  </>
                )}
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
                  disabled={saving || stats.sinCapturar === alumnos.length}
                >
                  {saving ? "Guardando..." : "Guardar Calificaciones"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      ) : (
        grupoId &&
        materiaId &&
        evaluacionId && (
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

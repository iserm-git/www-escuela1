// app/gestion-curso/calificaciones/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  Snackbar,
  IconButton,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  MenuBook as MenuBookIcon,
  Assessment as EvaluationIcon,
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { calificacionService } from "@/services/calificacionService";
import type { Calificacion, Evaluacion } from "@/types/gestion-curso";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function CalificacionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Estado de datos
  const [calificacion, setCalificacion] = useState<Calificacion | null>(null);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    evaluacion_id: 0,
    calificacion: "",
  });

  // Estado de validación
  const [error, setError] = useState("");

  // Estado de modales
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Estado de notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Cargar datos
  useEffect(() => {
    if (id) {
      loadCalificacion();
      loadEvaluaciones();
    }
  }, [id]);

  const loadCalificacion = async () => {
    try {
      setLoading(true);
      const data = await calificacionService.getById(Number(id));
      setCalificacion(data);
      setFormData({
        evaluacion_id: data.evaluacion_id,
        calificacion: data.calificacion.toString(),
      });
    } catch (error) {
      showSnackbar("Error al cargar la calificación", "error");
      console.error("Error:", error);
      setTimeout(() => router.push("/gestion-curso/calificaciones"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const loadEvaluaciones = async () => {
    try {
      const data = await calificacionService.getEvaluaciones();
      setEvaluaciones(data);
    } catch (error) {
      console.error("Error al cargar evaluaciones:", error);
    }
  };

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
    setFormData({ ...formData, calificacion: value });
    if (value) {
      validateCalificacion(value);
    } else {
      setError("");
    }
  };

  const handleSave = async () => {
    if (!calificacion) return;

    if (
      !formData.calificacion ||
      !validateCalificacion(formData.calificacion)
    ) {
      return;
    }

    try {
      setSaving(true);
      await calificacionService.update(calificacion.id, {
        evaluacion_id: formData.evaluacion_id,
        calificacion: parseFloat(formData.calificacion),
      });
      showSnackbar("Calificación actualizada correctamente", "success");
      setEditMode(false);
      loadCalificacion();
    } catch (error) {
      showSnackbar("Error al actualizar la calificación", "error");
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!calificacion) return;

    try {
      await calificacionService.delete(calificacion.id);
      showSnackbar("Calificación eliminada correctamente", "success");
      setTimeout(() => router.push("/gestion-curso/calificaciones"), 1500);
    } catch (error) {
      showSnackbar("Error al eliminar la calificación", "error");
      console.error("Error:", error);
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  const handleCancel = () => {
    if (calificacion) {
      setFormData({
        evaluacion_id: calificacion.evaluacion_id,
        calificacion: calificacion.calificacion.toString(),
      });
    }
    setError("");
    setEditMode(false);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const getCalificacionColor = (cal: number) => {
    if (cal < 6) return "error.main";
    if (cal < 8) return "warning.main";
    return "success.main";
  };

  const getCalificacionIcon = (cal: number) => {
    if (cal < 6)
      return <TrendingDownIcon sx={{ fontSize: 48 }} color="error" />;
    if (cal < 8)
      return <TrendingUpIcon sx={{ fontSize: 48 }} color="warning" />;
    return <CheckIcon sx={{ fontSize: 48 }} color="success" />;
  };

  const getEstatusCalificacion = (cal: number) => {
    return cal >= 6 ? "Aprobado" : "Reprobado";
  };

  const getEvaluacionNombre = (id: number) => {
    const evaluacion = evaluaciones.find((e) => e.id === id);
    return evaluacion ? evaluacion.nombre : "N/A";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!calificacion) {
    return (
      <Box>
        <Alert severity="error">No se encontró la calificación</Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => router.push("/gestion-curso/calificaciones")}
          sx={{ mt: 2 }}
        >
          Volver a la lista
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={() => router.push("/gestion-curso/calificaciones")}
            sx={{ alignSelf: "flex-start" }}
          >
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Detalle de Calificación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {calificacion.id}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          {!editMode ? (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Eliminar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={
                  saving ? <CircularProgress size={20} /> : <SaveIcon />
                }
                onClick={handleSave}
                disabled={saving || !!error || !formData.calificacion}
              >
                Guardar
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Información del Alumno */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Alumno
                  </Typography>
                </Stack>
                <Divider />
                <Typography variant="h6" color="primary">
                  {calificacion.alumno_nombre || "Sin nombre"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {calificacion.alumno_id}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del Grupo */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ClassIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Grupo
                  </Typography>
                </Stack>
                <Divider />
                <Typography variant="h6">
                  {calificacion.grupo_nombre || "Sin grupo"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Carga ID: {calificacion.carga_id}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de la Materia */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MenuBookIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Materia
                  </Typography>
                </Stack>
                <Divider />
                <Typography variant="h6" noWrap>
                  {calificacion.materia_nombre || "Sin materia"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta de Calificación Principal */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${getCalificacionColor(
                parseFloat(formData.calificacion || "0")
              )} 0%, ${getCalificacionColor(
                parseFloat(formData.calificacion || "0")
              )}dd 100%)`,
              color: "white",
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Stack spacing={2} alignItems="center">
                  {getCalificacionIcon(
                    parseFloat(formData.calificacion || "0")
                  )}
                  <Typography variant="h2" fontWeight={900}>
                    {parseFloat(formData.calificacion || "0").toFixed(1)}
                  </Typography>
                  <Chip
                    label={getEstatusCalificacion(
                      parseFloat(formData.calificacion || "0")
                    )}
                    sx={{
                      bgcolor: "white",
                      color: getCalificacionColor(
                        parseFloat(formData.calificacion || "0")
                      ),
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                    icon={
                      parseFloat(formData.calificacion || "0") >= 6 ? (
                        <CheckIcon />
                      ) : (
                        <CancelIcon />
                      )
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Progreso de Calificación
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (parseFloat(formData.calificacion || "0") / 10) * 100
                    }
                    sx={{
                      height: 12,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.3)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "white",
                      },
                    }}
                  />
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {(
                      (parseFloat(formData.calificacion || "0") / 10) *
                      100
                    ).toFixed(0)}
                    % del máximo
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Detalles de la Calificación */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Detalles de la Calificación
            </Typography>

            <Grid container spacing={3}>
              {/* Evaluación */}
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <FormControl fullWidth required>
                    <InputLabel>Evaluación</InputLabel>
                    <Select
                      value={formData.evaluacion_id}
                      label="Evaluación"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          evaluacion_id: Number(e.target.value),
                        })
                      }
                    >
                      {evaluaciones.map((evaluacion) => (
                        <MenuItem key={evaluacion.id} value={evaluacion.id}>
                          {evaluacion.nombre} ({evaluacion.ponderacion}%)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Evaluación
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EvaluationIcon color="primary" />
                      <Typography variant="h6">
                        {calificacion.evaluacion_nombre || "N/A"}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Grid>

              {/* Calificación */}
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Calificación"
                    type="number"
                    value={formData.calificacion}
                    onChange={(e) => handleCalificacionChange(e.target.value)}
                    required
                    error={!!error}
                    helperText={error || "Rango válido: 0.0 - 10.0"}
                    inputProps={{
                      min: 0,
                      max: 10,
                      step: 0.1,
                    }}
                    InputProps={{
                      startAdornment: (
                        <GradeIcon color="primary" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Calificación
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <GradeIcon sx={{ fontSize: 32 }} color="primary" />
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          color: getCalificacionColor(
                            calificacion.calificacion
                          ),
                        }}
                      >
                        {calificacion.calificacion.toFixed(1)}
                      </Typography>
                      <Chip
                        label={getEstatusCalificacion(
                          calificacion.calificacion
                        )}
                        color={
                          calificacion.calificacion >= 6 ? "success" : "error"
                        }
                      />
                    </Stack>
                  </Box>
                )}
              </Grid>

              {/* Fecha de Captura */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Fecha de Captura
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarIcon color="action" />
                    <Typography variant="body1">
                      {formatDate(calificacion.capturada_en)}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Capturada Por */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Capturada Por
                  </Typography>
                  <Typography variant="body1">
                    Usuario ID: {calificacion.capturada_por || "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Escala de Calificaciones (Referencia) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: "background.default" }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Escala de Calificaciones
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: "error.main",
                    }}
                  />
                  <Typography variant="body2">
                    <strong>0.0 - 5.9:</strong> Reprobado
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: "warning.main",
                    }}
                  />
                  <Typography variant="body2">
                    <strong>6.0 - 7.9:</strong> Aprobado (Regular)
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: "success.main",
                    }}
                  />
                  <Typography variant="body2">
                    <strong>8.0 - 10.0:</strong> Excelente
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Alerta de Edición */}
        {editMode && (
          <Grid item xs={12}>
            <Alert severity="warning" icon={<EditIcon />}>
              <strong>Modo de edición activo.</strong> Los cambios se guardarán
              en el historial de modificaciones. Asegúrate de verificar la
              información antes de guardar.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar la calificación de ${calificacion.alumno_nombre} en ${calificacion.evaluacion_nombre}? Esta acción no se puede deshacer y afectará el promedio del alumno.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />

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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

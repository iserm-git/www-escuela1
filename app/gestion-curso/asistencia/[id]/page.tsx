"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
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
  Chip,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as PresenteIcon,
  Cancel as AusenteIcon,
  Schedule as RetardoIcon,
  Assignment as JustificadoIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  MenuBook as MenuBookIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { asistenciaService } from "@/services/asistenciaService";
import type { Asistencia, EstadoAsistencia } from "@/types/gestion-curso";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function AsistenciaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Estado de datos
  const [asistencia, setAsistencia] = useState<Asistencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    fecha: "",
    estado: "presente" as EstadoAsistencia,
    observaciones: "",
  });

  // Estado de modales
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Estado de notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Cargar datos de la asistencia
  useEffect(() => {
    if (id) {
      loadAsistencia();
    }
  }, [id]);

  const loadAsistencia = async () => {
    try {
      setLoading(true);
      const data = await asistenciaService.getById(Number(id));
      setAsistencia(data);
      setFormData({
        fecha: data.fecha,
        estado: data.estado,
        observaciones: data.observaciones || "",
      });
    } catch (error) {
      showSnackbar("Error al cargar la asistencia", "error");
      console.error("Error:", error);
      setTimeout(() => router.push("/gestion-curso/asistencia"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!asistencia) return;

    try {
      setSaving(true);
      await asistenciaService.update(asistencia.id, {
        fecha: formData.fecha,
        estado: formData.estado,
        observaciones: formData.observaciones.trim() || undefined,
      });
      showSnackbar("Asistencia actualizada correctamente", "success");
      setEditMode(false);
      loadAsistencia();
    } catch (error) {
      showSnackbar("Error al actualizar la asistencia", "error");
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!asistencia) return;

    try {
      await asistenciaService.delete(asistencia.id);
      showSnackbar("Asistencia eliminada correctamente", "success");
      setTimeout(() => router.push("/gestion-curso/asistencia"), 1500);
    } catch (error) {
      showSnackbar("Error al eliminar la asistencia", "error");
      console.error("Error:", error);
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  const handleCancel = () => {
    if (asistencia) {
      setFormData({
        fecha: asistencia.fecha,
        estado: asistencia.estado,
        observaciones: asistencia.observaciones || "",
      });
    }
    setEditMode(false);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const getEstadoIcon = (estado: EstadoAsistencia) => {
    const icons = {
      presente: <PresenteIcon sx={{ fontSize: 48 }} color="success" />,
      ausente: <AusenteIcon sx={{ fontSize: 48 }} color="error" />,
      retardo: <RetardoIcon sx={{ fontSize: 48 }} color="warning" />,
      justificado: <JustificadoIcon sx={{ fontSize: 48 }} color="info" />,
    };
    return icons[estado];
  };

  const getEstadoColor = (estado: EstadoAsistencia) => {
    const colors = {
      presente: "success.main",
      ausente: "error.main",
      retardo: "warning.main",
      justificado: "info.main",
    };
    return colors[estado];
  };

  const getEstadoLabel = (estado: EstadoAsistencia) => {
    const labels = {
      presente: "Presente",
      ausente: "Ausente",
      retardo: "Retardo",
      justificado: "Justificado",
    };
    return labels[estado];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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

  if (!asistencia) {
    return (
      <Box>
        <Alert severity="error">No se encontró la asistencia</Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => router.push("/gestion-curso/asistencia")}
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
            onClick={() => router.push("/gestion-curso/asistencia")}
            sx={{ alignSelf: "flex-start" }}
          >
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Detalle de Asistencia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {asistencia.id} • {formatDate(asistencia.fecha)}
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
                disabled={saving}
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
                  {asistencia.alumno_nombre || "Sin nombre"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {asistencia.alumno_id}
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
                  {asistencia.grupo_nombre || "Sin grupo"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Carga ID: {asistencia.carga_id}
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
                  {asistencia.materia_nombre || "Sin materia"}
                </Typography>
                {asistencia.profesor_nombre && (
                  <Typography variant="body2" color="text.secondary">
                    Profesor: {asistencia.profesor_nombre}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Detalles de la Asistencia */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Detalles de la Asistencia
            </Typography>

            <Grid container spacing={3}>
              {/* Estado */}
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <FormControl fullWidth>
                    <InputLabel>Estado *</InputLabel>
                    <Select
                      value={formData.estado}
                      label="Estado *"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estado: e.target.value as EstadoAsistencia,
                        })
                      }
                    >
                      <MenuItem value="presente">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PresenteIcon fontSize="small" color="success" />
                          <span>Presente</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="ausente">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AusenteIcon fontSize="small" color="error" />
                          <span>Ausente</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="retardo">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <RetardoIcon fontSize="small" color="warning" />
                          <span>Retardo</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="justificado">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <JustificadoIcon fontSize="small" color="info" />
                          <span>Justificado</span>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Estado
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {getEstadoIcon(asistencia.estado)}
                      <Typography
                        variant="h5"
                        sx={{ color: getEstadoColor(asistencia.estado) }}
                      >
                        {getEstadoLabel(asistencia.estado)}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Grid>

              {/* Fecha */}
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: new Date().toISOString().split("T")[0] }}
                    required
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Fecha
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarIcon color="primary" />
                      <Typography variant="h6">
                        {formatDate(asistencia.fecha)}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Grid>

              {/* Observaciones */}
              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Observaciones"
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observaciones: e.target.value,
                      })
                    }
                    multiline
                    rows={4}
                    placeholder="Agregar comentarios o notas adicionales..."
                    inputProps={{ maxLength: 500 }}
                    helperText={`${formData.observaciones.length}/500 caracteres`}
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Observaciones
                    </Typography>
                    {asistencia.observaciones ? (
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "background.default" }}
                      >
                        <Typography variant="body1">
                          {asistencia.observaciones}
                        </Typography>
                      </Paper>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        Sin observaciones
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Información Adicional */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: "background.default" }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Nota:</strong> Los cambios realizados quedarán registrados
              en el historial de modificaciones. Asegúrate de verificar la
              información antes de guardar.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el registro de asistencia de ${
          asistencia.alumno_nombre
        } del ${formatDate(
          asistencia.fecha
        )}? Esta acción no se puede deshacer.`}
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

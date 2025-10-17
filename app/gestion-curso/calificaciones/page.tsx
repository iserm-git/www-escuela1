"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  StarRate as StarIcon,
} from "@mui/icons-material";
import { calificacionService } from "@/services/calificacionService";
import type {
  Calificacion,
  CalificacionFiltros,
  Evaluacion,
} from "@/types/gestion-curso";
import CalificacionDialog from "@/components/gestion-curso/CalificacionDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function CalificacionesPage() {
  const router = useRouter();

  // Estado de datos
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Estado de filtros
  const [showFilters, setShowFilters] = useState(true);
  const [filtros, setFiltros] = useState<CalificacionFiltros>({
    grupo_id: undefined,
    materia_id: undefined,
    evaluacion_id: undefined,
    alumno_id: undefined,
  });

  // Estado de modales
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCalificacion, setSelectedCalificacion] =
    useState<Calificacion | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Estado de notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Estadísticas
  const [stats, setStats] = useState({
    promedio: 0,
    aprobados: 0,
    reprobados: 0,
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadCalificaciones();
    loadEvaluaciones();
  }, [page, rowsPerPage]);

  // Calcular estadísticas cuando cambien las calificaciones
  useEffect(() => {
    calculateStats();
  }, [calificaciones]);

  const loadCalificaciones = async () => {
    try {
      setLoading(true);
      const data = await calificacionService.getAll({
        ...filtros,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      setCalificaciones(data);
      setTotalCount(data.length > 0 ? 100 : 0); // Mock - reemplazar con data.total
    } catch (error) {
      showSnackbar("Error al cargar las calificaciones", "error");
      console.error("Error:", error);
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

  const calculateStats = () => {
    if (calificaciones.length === 0) {
      setStats({ promedio: 0, aprobados: 0, reprobados: 0 });
      return;
    }

    const suma = calificaciones.reduce((acc, cal) => acc + cal.calificacion, 0);
    const promedio = Number((suma / calificaciones.length).toFixed(2));
    const aprobados = calificaciones.filter(
      (cal) => cal.calificacion >= 6
    ).length;
    const reprobados = calificaciones.filter(
      (cal) => cal.calificacion < 6
    ).length;

    setStats({ promedio, aprobados, reprobados });
  };

  const handleApplyFilters = () => {
    setPage(0);
    loadCalificaciones();
  };

  const handleClearFilters = () => {
    setFiltros({
      grupo_id: undefined,
      materia_id: undefined,
      evaluacion_id: undefined,
      alumno_id: undefined,
    });
    setPage(0);
  };

  const handleEdit = (calificacion: Calificacion) => {
    setSelectedCalificacion(calificacion);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await calificacionService.delete(deleteId);
      showSnackbar("Calificación eliminada correctamente", "success");
      loadCalificaciones();
    } catch (error) {
      showSnackbar("Error al eliminar la calificación", "error");
      console.error("Error:", error);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (calificacion: Calificacion) => {
    try {
      if (calificacion.id) {
        await calificacionService.update(calificacion.id, calificacion);
        showSnackbar("Calificación actualizada correctamente", "success");
      } else {
        await calificacionService.create(calificacion);
        showSnackbar("Calificación registrada correctamente", "success");
      }
      setDialogOpen(false);
      setSelectedCalificacion(null);
      loadCalificaciones();
    } catch (error) {
      showSnackbar("Error al guardar la calificación", "error");
      console.error("Error:", error);
    }
  };

  const handleExport = () => {
    showSnackbar("Exportando datos...", "info");
    // Implementar lógica de exportación (Excel, PDF, etc.)
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const getCalificacionChip = (calificacion: number) => {
    let color: "error" | "warning" | "success" = "success";
    let icon = <StarIcon fontSize="small" />;

    if (calificacion < 6) {
      color = "error";
      icon = <TrendingDownIcon fontSize="small" />;
    } else if (calificacion < 8) {
      color = "warning";
      icon = <TrendingUpIcon fontSize="small" />;
    }

    return (
      <Chip
        icon={icon}
        label={calificacion.toFixed(1)}
        color={color}
        size="small"
        sx={{ fontWeight: 700, minWidth: 60 }}
      />
    );
  };

  const getCalificacionColor = (calificacion: number) => {
    if (calificacion < 6) return "error.main";
    if (calificacion < 8) return "warning.main";
    return "success.main";
  };

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
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Registro de Calificaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta y administra las calificaciones de los alumnos
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualizar">
            <IconButton
              color="primary"
              onClick={loadCalificaciones}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar">
            <IconButton color="primary" onClick={handleExport}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              router.push("/gestion-curso/calificaciones/registrar")
            }
          >
            Capturar Calificaciones
          </Button>
        </Stack>
      </Stack>

      {/* Estadísticas */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          divider={<Box sx={{ borderLeft: 1, borderColor: "divider" }} />}
        >
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Promedio General
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              color={getCalificacionColor(stats.promedio)}
            >
              {stats.promedio.toFixed(2)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(stats.promedio / 10) * 100}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 1,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  bgcolor: getCalificacionColor(stats.promedio),
                },
              }}
            />
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Aprobados
            </Typography>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {stats.aprobados}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {calificaciones.length > 0
                ? `${((stats.aprobados / calificaciones.length) * 100).toFixed(
                    0
                  )}%`
                : "0%"}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Reprobados
            </Typography>
            <Typography variant="h4" fontWeight={700} color="error.main">
              {stats.reprobados}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {calificaciones.length > 0
                ? `${((stats.reprobados / calificaciones.length) * 100).toFixed(
                    0
                  )}%`
                : "0%"}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Registros
            </Typography>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {calificaciones.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calificaciones
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={showFilters ? 2 : 0}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterIcon color="action" />
            <Typography variant="subtitle2" fontWeight={600}>
              Filtros
            </Typography>
          </Stack>
          <Button size="small" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Ocultar" : "Mostrar"}
          </Button>
        </Stack>

        {showFilters && (
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
            >
              <TextField
                select
                label="Grupo"
                size="small"
                value={filtros.grupo_id || ""}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    grupo_id: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1">1A</MenuItem>
                <MenuItem value="2">2B</MenuItem>
                <MenuItem value="3">3C</MenuItem>
              </TextField>

              <TextField
                select
                label="Materia"
                size="small"
                value={filtros.materia_id || ""}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    materia_id: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="1">Lenguajes Web</MenuItem>
                <MenuItem value="2">Bases de Datos</MenuItem>
                <MenuItem value="3">Programación Móvil</MenuItem>
              </TextField>

              <TextField
                select
                label="Evaluación"
                size="small"
                value={filtros.evaluacion_id || ""}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    evaluacion_id: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">Todas</MenuItem>
                {evaluaciones.map((evaluacion) => (
                  <MenuItem key={evaluacion.id} value={evaluacion.id}>
                    {evaluacion.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Buscar Alumno"
                size="small"
                placeholder="Nombre o matrícula"
                value={filtros.alumno_id || ""}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    alumno_id: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                sx={{ minWidth: 200 }}
              />
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilters}
              >
                Aplicar Filtros
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>

      {/* Tabla de Calificaciones */}
      <Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Alumno</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Grupo</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Materia</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Evaluación</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Calificación</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Capturada Por</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Acciones</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calificaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary" variant="body1">
                          No se encontraron calificaciones
                        </Typography>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                          sx={{ mt: 1 }}
                        >
                          Intenta ajustar los filtros o captura nuevas
                          calificaciones
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    calificaciones.map((calificacion) => (
                      <TableRow key={calificacion.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {calificacion.alumno_nombre || "Sin nombre"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {calificacion.grupo_nombre || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {calificacion.materia_nombre || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {calificacion.evaluacion_nombre || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {getCalificacionChip(calificacion.calificacion)}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {calificacion.capturada_en
                              ? new Date(
                                  calificacion.capturada_en
                                ).toLocaleDateString("es-MX")
                              : "—"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(calificacion)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(calificacion.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* Diálogo de Edición */}
      <CalificacionDialog
        open={dialogOpen}
        initial={selectedCalificacion}
        evaluaciones={evaluaciones}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCalificacion(null);
        }}
        onSave={handleSave}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta calificación? Esta acción no se puede deshacer y puede afectar el promedio del alumno."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setDeleteId(null);
        }}
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

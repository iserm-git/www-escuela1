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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as PresenteIcon,
  Cancel as AusenteIcon,
  Schedule as RetardoIcon,
  Assignment as JustificadoIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { asistenciaService } from "@/services/asistenciaService";
import type {
  Asistencia,
  EstadoAsistencia,
  AsistenciaFiltros,
} from "@/types/gestion-curso";
import AsistenciaDialog from "@/components/gestion-curso/AsistenciaDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function AsistenciaPage() {
  const router = useRouter();

  // Estado de datos
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Estado de filtros
  const [showFilters, setShowFilters] = useState(true);
  const [filtros, setFiltros] = useState<AsistenciaFiltros>({
    fecha_inicio: "",
    fecha_fin: "",
    grupo_id: undefined,
    materia_id: undefined,
    estado: undefined,
  });

  // Estado de modales
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsistencia, setSelectedAsistencia] =
    useState<Asistencia | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Estado de notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadAsistencias();
  }, [page, rowsPerPage]);

  const loadAsistencias = async () => {
    try {
      setLoading(true);
      const data = await asistenciaService.getAll({
        ...filtros,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      setAsistencias(data);
      // El backend debería devolver el total de registros
      setTotalCount(data.length > 0 ? 100 : 0); // Mock - reemplazar con data.total
    } catch (error) {
      showSnackbar("Error al cargar las asistencias", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(0);
    loadAsistencias();
  };

  const handleClearFilters = () => {
    setFiltros({
      fecha_inicio: "",
      fecha_fin: "",
      grupo_id: undefined,
      materia_id: undefined,
      estado: undefined,
    });
    setPage(0);
  };

  const handleEdit = (asistencia: Asistencia) => {
    setSelectedAsistencia(asistencia);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await asistenciaService.delete(deleteId);
      showSnackbar("Asistencia eliminada correctamente", "success");
      loadAsistencias();
    } catch (error) {
      showSnackbar("Error al eliminar la asistencia", "error");
      console.error("Error:", error);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (asistencia: Asistencia) => {
    try {
      if (asistencia.id) {
        await asistenciaService.update(asistencia.id, asistencia);
        showSnackbar("Asistencia actualizada correctamente", "success");
      } else {
        await asistenciaService.create(asistencia);
        showSnackbar("Asistencia registrada correctamente", "success");
      }
      setDialogOpen(false);
      setSelectedAsistencia(null);
      loadAsistencias();
    } catch (error) {
      showSnackbar("Error al guardar la asistencia", "error");
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

  const getEstadoChip = (estado: EstadoAsistencia) => {
    const configs = {
      presente: {
        icon: <PresenteIcon fontSize="small" />,
        color: "success" as const,
        label: "Presente",
      },
      ausente: {
        icon: <AusenteIcon fontSize="small" />,
        color: "error" as const,
        label: "Ausente",
      },
      retardo: {
        icon: <RetardoIcon fontSize="small" />,
        color: "warning" as const,
        label: "Retardo",
      },
      justificado: {
        icon: <JustificadoIcon fontSize="small" />,
        color: "info" as const,
        label: "Justificado",
      },
    };

    const config = configs[estado];
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            Registro de Asistencias
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta y administra los registros de asistencia
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualizar">
            <IconButton
              color="primary"
              onClick={loadAsistencias}
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
            onClick={() => router.push("/gestion-curso/asistencia/registrar")}
          >
            Registrar Asistencia
          </Button>
        </Stack>
      </Stack>

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
                label="Fecha Inicio"
                type="date"
                size="small"
                value={filtros.fecha_inicio}
                onChange={(e) =>
                  setFiltros({ ...filtros, fecha_inicio: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />

              <TextField
                label="Fecha Fin"
                type="date"
                size="small"
                value={filtros.fecha_fin}
                onChange={(e) =>
                  setFiltros({ ...filtros, fecha_fin: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />

              <TextField
                select
                label="Estado"
                size="small"
                value={filtros.estado || ""}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    estado: (e.target.value as EstadoAsistencia) || undefined,
                  })
                }
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="presente">Presente</MenuItem>
                <MenuItem value="ausente">Ausente</MenuItem>
                <MenuItem value="retardo">Retardo</MenuItem>
                <MenuItem value="justificado">Justificado</MenuItem>
              </TextField>

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

      {/* Tabla de Asistencias */}
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
                      <strong>Fecha</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Estado</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Observaciones</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Acciones</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asistencias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary" variant="body1">
                          No se encontraron registros de asistencia
                        </Typography>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                          sx={{ mt: 1 }}
                        >
                          Intenta ajustar los filtros o registra una nueva
                          asistencia
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    asistencias.map((asistencia) => (
                      <TableRow key={asistencia.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {asistencia.alumno_nombre || "Sin nombre"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {asistencia.grupo_nombre || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {asistencia.materia_nombre || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(asistencia.fecha)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getEstadoChip(asistencia.estado)}
                        </TableCell>
                        <TableCell>
                          {asistencia.observaciones ? (
                            <Tooltip title={asistencia.observaciones}>
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{ maxWidth: 200, cursor: "help" }}
                              >
                                {asistencia.observaciones}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              —
                            </Typography>
                          )}
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
                                onClick={() => handleEdit(asistencia)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(asistencia.id)}
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
      <AsistenciaDialog
        open={dialogOpen}
        initial={selectedAsistencia}
        onClose={() => {
          setDialogOpen(false);
          setSelectedAsistencia(null);
        }}
        onSave={handleSave}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este registro de asistencia? Esta acción no se puede deshacer."
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

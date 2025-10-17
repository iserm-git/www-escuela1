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
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as PresenteIcon,
  Cancel as AusenteIcon,
  Schedule as RetardoIcon,
  Assignment as JustificadoIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { asistenciaService } from "@/services/asistenciaService";
import type {
  Asistencia,
  EstadoAsistencia,
  AsistenciaFiltros,
} from "@/types/gestion-curso";
import AsistenciaDialog from "@/components/gestion-curso/AsistenciaDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useRouter } from "next/navigation";

export default function AsistenciaPage() {
  const router = useRouter();

  // Estado de datos
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Estado de filtros
  const [filtros, setFiltros] = useState<AsistenciaFiltros>({
    fecha_inicio: "",
    fecha_fin: "",
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
    severity: "success" as "success" | "error" | "info",
  });

  // Cargar asistencias
  useEffect(() => {
    loadAsistencias();
  }, [page, rowsPerPage, filtros]);

  const loadAsistencias = async () => {
    try {
      setLoading(true);
      const data = await asistenciaService.getAll({
        ...filtros,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      setAsistencias(data);
      // En producción, el backend debería devolver el total
      setTotalCount(data.length);
    } catch (error) {
      showSnackbar("Error al cargar asistencias", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
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
      showSnackbar("Error al eliminar asistencia", "error");
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
      showSnackbar("Error al guardar asistencia", "error");
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const getEstadoChip = (estado: EstadoAsistencia) => {
    const configs = {
      presente: {
        icon: <PresenteIcon />,
        color: "success" as const,
        label: "Presente",
      },
      ausente: {
        icon: <AusenteIcon />,
        color: "error" as const,
        label: "Ausente",
      },
      retardo: {
        icon: <RetardoIcon />,
        color: "warning" as const,
        label: "Retardo",
      },
      justificado: {
        icon: <JustificadoIcon />,
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

  return (
    <Protected>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight={700}>
            Asistencias
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/gestion-curso/asistencia/registrar")}
          >
            Registrar Asistencia
          </Button>
        </Stack>

        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FilterIcon color="action" />
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
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="presente">Presente</MenuItem>
              <MenuItem value="ausente">Ausente</MenuItem>
              <MenuItem value="retardo">Retardo</MenuItem>
              <MenuItem value="justificado">Justificado</MenuItem>
            </TextField>
            <Button variant="outlined" onClick={loadAsistencias}>
              Aplicar Filtros
            </Button>
          </Stack>
        </Paper>

        {/* Tabla */}
        <Paper>
          {loading ? (
            <Box display="flex" justifyContent="center" py={10}>
              <CircularProgress />
            </Box>
          ) : (
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
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          No se encontraron registros de asistencia
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    asistencias.map((asistencia) => (
                      <TableRow key={asistencia.id} hover>
                        <TableCell>{asistencia.alumno_nombre}</TableCell>
                        <TableCell>{asistencia.grupo_nombre}</TableCell>
                        <TableCell>{asistencia.materia_nombre}</TableCell>
                        <TableCell>
                          {new Date(asistencia.fecha).toLocaleDateString(
                            "es-MX"
                          )}
                        </TableCell>
                        <TableCell>
                          {getEstadoChip(asistencia.estado)}
                        </TableCell>
                        <TableCell>
                          {asistencia.observaciones ? (
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ maxWidth: 200 }}
                            >
                              {asistencia.observaciones}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(asistencia)}
                            title="Editar"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(asistencia.id)}
                            title="Eliminar"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

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
          />
        </Paper>

        {/* Dialogo de Edición */}
        <AsistenciaDialog
          open={dialogOpen}
          initial={selectedAsistencia}
          onClose={() => {
            setDialogOpen(false);
            setSelectedAsistencia(null);
          }}
          onSave={handleSave}
        />

        {/* Dialogo de Confirmación */}
        <ConfirmDialog
          open={confirmDeleteOpen}
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar este registro de asistencia? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
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
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Protected>
  );
}

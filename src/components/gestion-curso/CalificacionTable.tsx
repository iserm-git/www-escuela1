"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Box,
  TablePagination,
  Checkbox,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  StarRate as StarIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import type { Calificacion } from "@/types/gestion-curso";

type Order = "asc" | "desc";
type OrderBy = keyof Calificacion;

interface CalificacionTableProps {
  calificaciones: Calificacion[];
  onEdit?: (calificacion: Calificacion) => void;
  onDelete?: (id: number) => void;
  onView?: (calificacion: Calificacion) => void;
  showActions?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: number[]) => void;
  loading?: boolean;
  dense?: boolean;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  showProgress?: boolean; // Mostrar barra de progreso en calificaciones
}

export default function CalificacionTable({
  calificaciones,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  selectable = false,
  onSelectionChange,
  loading = false,
  dense = false,
  stickyHeader = false,
  maxHeight,
  showProgress = false,
}: CalificacionTableProps) {
  // Estado de ordenamiento
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("calificacion");

  // Estado de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estado de selección
  const [selected, setSelected] = useState<number[]>([]);

  // Manejo de ordenamiento
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Función de comparación para ordenamiento
  const getComparator = (order: Order, orderBy: OrderBy) => {
    return order === "desc"
      ? (a: Calificacion, b: Calificacion) =>
          descendingComparator(a, b, orderBy)
      : (a: Calificacion, b: Calificacion) =>
          -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (
    a: Calificacion,
    b: Calificacion,
    orderBy: OrderBy
  ) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (bValue === undefined || bValue === null) return -1;
    if (aValue === undefined || aValue === null) return 1;

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  // Ordenar calificaciones
  const sortedCalificaciones = [...calificaciones].sort(
    getComparator(order, orderBy)
  );

  // Paginación
  const paginatedCalificaciones = sortedCalificaciones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Manejo de selección
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = calificaciones.map((c) => c.id);
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelect = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Utilidades de visualización
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

  const getEstatusIcon = (calificacion: number) => {
    if (calificacion >= 6) {
      return (
        <Tooltip title="Aprobado">
          <CheckIcon fontSize="small" color="success" />
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Reprobado">
        <CancelIcon fontSize="small" color="error" />
      </Tooltip>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Cabeceras de la tabla
  interface HeadCell {
    id: OrderBy;
    label: string;
    sortable: boolean;
    align?: "left" | "right" | "center";
    width?: string;
  }

  const headCells: HeadCell[] = [
    { id: "alumno_nombre", label: "Alumno", sortable: true, width: "25%" },
    { id: "grupo_nombre", label: "Grupo", sortable: true, width: "10%" },
    { id: "materia_nombre", label: "Materia", sortable: true, width: "20%" },
    {
      id: "evaluacion_nombre",
      label: "Evaluación",
      sortable: true,
      width: "15%",
    },
    {
      id: "calificacion",
      label: "Calificación",
      sortable: true,
      align: "center",
      width: "15%",
    },
    {
      id: "capturada_en",
      label: "Fecha",
      sortable: true,
      align: "center",
      width: "15%",
    },
  ];

  return (
    <Box>
      <TableContainer sx={{ maxHeight: maxHeight || "auto" }}>
        <Table stickyHeader={stickyHeader} size={dense ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < calificaciones.length
                    }
                    checked={
                      calificaciones.length > 0 &&
                      selected.length === calificaciones.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}

              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || "left"}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ width: headCell.width }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      <strong>{headCell.label}</strong>
                    </TableSortLabel>
                  ) : (
                    <strong>{headCell.label}</strong>
                  )}
                </TableCell>
              ))}

              {showActions && (
                <TableCell align="right">
                  <strong>Acciones</strong>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    headCells.length +
                    (selectable ? 1 : 0) +
                    (showActions ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 5 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedCalificaciones.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    headCells.length +
                    (selectable ? 1 : 0) +
                    (showActions ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography color="text.secondary" variant="body1">
                    No se encontraron calificaciones
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Intenta ajustar los filtros o captura nuevas calificaciones
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCalificaciones.map((calificacion) => {
                const isItemSelected = isSelected(calificacion.id);

                return (
                  <TableRow
                    key={calificacion.id}
                    hover
                    selected={isItemSelected}
                    sx={{
                      cursor: onView ? "pointer" : "default",
                      "&:hover": {
                        bgcolor: onView ? "action.hover" : "inherit",
                      },
                    }}
                    onClick={onView ? () => onView(calificacion) : undefined}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleSelect(calificacion.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}

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
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {calificacion.materia_nombre || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {calificacion.evaluacion_nombre || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Stack spacing={0.5} alignItems="center">
                        {getCalificacionChip(calificacion.calificacion)}
                        {showProgress && (
                          <Box sx={{ width: "100%", maxWidth: 60 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(calificacion.calificacion / 10) * 100}
                              sx={{
                                height: 4,
                                borderRadius: 1,
                                bgcolor: "action.hover",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: getCalificacionColor(
                                    calificacion.calificacion
                                  ),
                                },
                              }}
                            />
                          </Box>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(calificacion.capturada_en)}
                      </Typography>
                    </TableCell>

                    {showActions && (
                      <TableCell
                        align="right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          {onView && (
                            <Tooltip title="Ver detalle">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onView(calificacion)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onEdit && (
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onEdit(calificacion)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDelete(calificacion.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {calificaciones.length > 0 && (
        <TablePagination
          component="div"
          count={sortedCalificaciones.length}
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      )}
    </Box>
  );
}

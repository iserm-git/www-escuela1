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
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  StarRate as StarIcon,
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
  loading?: boolean;
  dense?: boolean;
  stickyHeader?: boolean;
  maxHeight?: number | string;
}

export default function CalificacionTable({
  calificaciones,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  loading = false,
  dense = false,
  stickyHeader = false,
  maxHeight,
}: CalificacionTableProps) {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("calificacion");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const sortedCalificaciones = [...calificaciones].sort(
    getComparator(order, orderBy)
  );

  const paginatedCalificaciones = sortedCalificaciones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  interface HeadCell {
    id: OrderBy;
    label: string;
    sortable: boolean;
    align?: "left" | "right" | "center";
  }

  const headCells: HeadCell[] = [
    { id: "alumno_nombre", label: "Alumno", sortable: true },
    { id: "grupo_nombre", label: "Grupo", sortable: true },
    { id: "materia_nombre", label: "Materia", sortable: true },
    { id: "evaluacion_nombre", label: "Evaluación", sortable: true },
    {
      id: "calificacion",
      label: "Calificación",
      sortable: true,
      align: "center",
    },
  ];

  return (
    <Box>
      <TableContainer sx={{ maxHeight: maxHeight || "auto" }}>
        <Table stickyHeader={stickyHeader} size={dense ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || "left"}
                  sortDirection={orderBy === headCell.id ? order : false}
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
                  colSpan={headCells.length + (showActions ? 1 : 0)}
                  align="center"
                  sx={{ py: 5 }}
                >
                  <Typography color="text.secondary">Cargando...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedCalificaciones.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headCells.length + (showActions ? 1 : 0)}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography color="text.secondary" variant="body1">
                    No se encontraron calificaciones
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCalificaciones.map((calificacion) => (
                <TableRow
                  key={calificacion.id}
                  hover
                  sx={{ cursor: onView ? "pointer" : "default" }}
                  onClick={onView ? () => onView(calificacion) : undefined}
                >
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
                    {getCalificacionChip(calificacion.calificacion)}
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Box>
  );
}

"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
// Iconos
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import Protected from "@/components/Protected";
import GrupoDialog from "@/components/GrupoDialog";
import GrupoDetailDialog from "@/components/GrupoDetailDialog";

type Grupo = {
  id: number;
  clave: string;
  nombre: string;
  carrera: string;
  limite_alumnos: number;
  alumnos_inscritos: number;
};

// Datos mock - reemplazar con llamada a API
const INITIAL_DATA: Grupo[] = [
  {
    id: 1,
    clave: "ISC-1A",
    nombre: "1er Semestre Grupo A",
    carrera: "ISC",
    limite_alumnos: 35,
    alumnos_inscritos: 32,
  },
  {
    id: 2,
    clave: "ISC-1B",
    nombre: "1er Semestre Grupo B",
    carrera: "ISC",
    limite_alumnos: 35,
    alumnos_inscritos: 30,
  },
  {
    id: 3,
    clave: "ISC-3A",
    nombre: "3er Semestre Grupo A",
    carrera: "ISC",
    limite_alumnos: 30,
    alumnos_inscritos: 28,
  },
  {
    id: 4,
    clave: "ITIC-1A",
    nombre: "1er Semestre Grupo A",
    carrera: "ITIC",
    limite_alumnos: 30,
    alumnos_inscritos: 25,
  },
  {
    id: 5,
    clave: "IIND-1A",
    nombre: "1er Semestre Grupo A",
    carrera: "IIND",
    limite_alumnos: 30,
    alumnos_inscritos: 29,
  },
  {
    id: 6,
    clave: "ISC-5A",
    nombre: "5to Semestre Grupo A",
    carrera: "ISC",
    limite_alumnos: 30,
    alumnos_inscritos: 22,
  },
  {
    id: 7,
    clave: "CP-1A",
    nombre: "1er Semestre Grupo A",
    carrera: "CP",
    limite_alumnos: 25,
    alumnos_inscritos: 24,
  },
  {
    id: 8,
    clave: "ISC-7A",
    nombre: "7mo Semestre Grupo A",
    carrera: "ISC",
    limite_alumnos: 25,
    alumnos_inscritos: 20,
  },
];

export default function GruposPage() {
  const [rows, setRows] = useState<Grupo[]>(INITIAL_DATA);
  const [filteredRows, setFilteredRows] = useState<Grupo[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog de edición/creación
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Grupo | null>(null);

  // Dialog de detalle
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingGrupo, setViewingGrupo] = useState<Grupo | null>(null);

  // Manejo de búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = rows.filter(
      (row) =>
        row.nombre.toLowerCase().includes(value.toLowerCase()) ||
        row.clave.toLowerCase().includes(value.toLowerCase()) ||
        row.carrera.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRows(filtered);
    setPage(0); // Reset a la primera página
  };

  // Paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // CRUD
  const handleNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (grupo: Grupo) => {
    setEditing(grupo);
    setOpen(true);
  };

  const handleViewDetail = (grupo: Grupo) => {
    setViewingGrupo(grupo);
    setDetailOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este grupo?")) {
      const newRows = rows.filter((r) => r.id !== id);
      setRows(newRows);
      setFilteredRows(
        newRows.filter(
          (row) =>
            row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.carrera.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleSave = (
    grupo: Partial<Grupo> & {
      clave: string;
      nombre: string;
      carrera: string;
      limite_alumnos: number;
    }
  ) => {
    if (grupo.id) {
      // Editar
      const newRows = rows.map((r) =>
        r.id === grupo.id ? ({ ...r, ...grupo } as Grupo) : r
      );
      setRows(newRows);
      setFilteredRows(
        newRows.filter(
          (row) =>
            row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.carrera.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      // Crear nuevo
      const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
      const newGrupo: Grupo = {
        id: nextId,
        clave: grupo.clave,
        nombre: grupo.nombre,
        carrera: grupo.carrera,
        limite_alumnos: grupo.limite_alumnos,
        alumnos_inscritos: grupo.alumnos_inscritos || 0,
      };
      const newRows = [...rows, newGrupo];
      setRows(newRows);
      setFilteredRows(newRows);
    }
    setOpen(false);
  };

  // Cálculo de filas visibles
  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Protected>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" component="h1">
            Gestión de Grupos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            size="large"
          >
            Nuevo Grupo
          </Button>
        </Stack>

        {/* Barra de búsqueda */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar por clave, nombre o carrera..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Tabla */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de grupos">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Clave
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Carrera
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Límite de Alumnos
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Alumnos Inscritos
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Ocupación
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron grupos
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => {
                  const ocupacion =
                    (row.alumnos_inscritos / row.limite_alumnos) * 100;
                  const ocupacionColor =
                    ocupacion >= 90
                      ? "error"
                      : ocupacion >= 70
                      ? "warning"
                      : "success";

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="body2" fontWeight="medium">
                          {row.clave}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.carrera}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {row.limite_alumnos}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <GroupIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {row.alumnos_inscritos}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${ocupacion.toFixed(0)}%`}
                          size="small"
                          color={ocupacionColor}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewDetail(row)}
                            title="Ver detalle"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(row)}
                            title="Editar"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(row.id)}
                            title="Eliminar"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Paginación */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>

        {/* Dialog de Grupo para crear/editar */}
        <GrupoDialog
          open={open}
          initial={editing ?? undefined}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />

        {/* Dialog de detalle del grupo */}
        <GrupoDetailDialog
          open={detailOpen}
          grupo={viewingGrupo}
          onClose={() => setDetailOpen(false)}
        />
      </Container>
    </Protected>
  );
}

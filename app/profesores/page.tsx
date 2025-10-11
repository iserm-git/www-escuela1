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

import Protected from "@/components/Protected";
import ProfesorDialog from "@/components/ProfesorDialog";
import ProfesorDetailDialog from "@/components/ProfesorDetailDialog";

type Profesor = {
  id: number;
  clave: string;
  nombre: string;
  apellidos: string;
  carrera: string;
  activo?: boolean;
  email?: string;
  telefono?: string;
  fechaIngreso?: string;
};

// Datos mock - reemplazar con llamada a API
const INITIAL_DATA: Profesor[] = [
  {
    id: 1,
    clave: "PROF001",
    nombre: "María",
    apellidos: "González López",
    carrera: "ISC",
    activo: true,
    email: "maria.gonzalez@example.com",
    telefono: "444-123-4567",
    fechaIngreso: "2020-08-15",
  },
  {
    id: 2,
    clave: "PROF002",
    nombre: "Juan",
    apellidos: "Martínez Pérez",
    carrera: "ITIC",
    activo: true,
    email: "juan.martinez@example.com",
    telefono: "444-234-5678",
    fechaIngreso: "2019-01-10",
  },
  {
    id: 3,
    clave: "PROF003",
    nombre: "Ana",
    apellidos: "Rodríguez Sánchez",
    carrera: "IIND",
    activo: true,
    email: "ana.rodriguez@example.com",
    fechaIngreso: "2021-08-15",
  },
  {
    id: 4,
    clave: "PROF004",
    nombre: "Carlos",
    apellidos: "López Torres",
    carrera: "ISC",
    activo: false,
    email: "carlos.lopez@example.com",
    telefono: "444-345-6789",
    fechaIngreso: "2018-02-20",
  },
  {
    id: 5,
    clave: "PROF005",
    nombre: "Laura",
    apellidos: "Hernández García",
    carrera: "CP",
    activo: true,
    email: "laura.hernandez@example.com",
    telefono: "444-456-7890",
    fechaIngreso: "2022-01-15",
  },
  {
    id: 6,
    clave: "PROF006",
    nombre: "Roberto",
    apellidos: "Jiménez Flores",
    carrera: "IIA",
    activo: true,
    fechaIngreso: "2020-08-15",
  },
  {
    id: 7,
    clave: "PROF007",
    nombre: "Patricia",
    apellidos: "Morales Vega",
    carrera: "IGE",
    activo: true,
    fechaIngreso: "2021-08-15",
  },
  {
    id: 8,
    clave: "PROF008",
    nombre: "José",
    apellidos: "Ramírez Castro",
    carrera: "IE",
    activo: true,
    fechaIngreso: "2019-08-15",
  },
  {
    id: 9,
    clave: "PROF009",
    nombre: "Diana",
    apellidos: "Fernández Cruz",
    carrera: "IIAS",
    activo: true,
    fechaIngreso: "2020-01-10",
  },
  {
    id: 10,
    clave: "PROF010",
    nombre: "Miguel",
    apellidos: "Torres Ortiz",
    carrera: "ARQ",
    activo: true,
    fechaIngreso: "2021-08-15",
  },
];

export default function ProfesoresPage() {
  const [rows, setRows] = useState<Profesor[]>(INITIAL_DATA);
  const [filteredRows, setFilteredRows] = useState<Profesor[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog de edición/creación
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Profesor | null>(null);

  // Dialog de detalle
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingProfesor, setViewingProfesor] = useState<Profesor | null>(null);

  // Manejo de búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = rows.filter(
      (row) =>
        row.nombre.toLowerCase().includes(value.toLowerCase()) ||
        row.apellidos.toLowerCase().includes(value.toLowerCase()) ||
        row.clave.toLowerCase().includes(value.toLowerCase()) ||
        row.carrera?.toLowerCase().includes(value.toLowerCase())
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

  const handleEdit = (profesor: Profesor) => {
    setEditing(profesor);
    setOpen(true);
  };

  const handleViewDetail = (profesor: Profesor) => {
    setViewingProfesor(profesor);
    setDetailOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este profesor?")) {
      const newRows = rows.filter((r) => r.id !== id);
      setRows(newRows);
      setFilteredRows(
        newRows.filter(
          (row) =>
            row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.clave.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleSave = (
    profesor: Partial<Profesor> & {
      clave: string;
      nombre: string;
      apellidos: string;
      carrera: string;
    }
  ) => {
    if (profesor.id) {
      // Editar
      const newRows = rows.map((r) =>
        r.id === profesor.id ? ({ ...r, ...profesor } as Profesor) : r
      );
      setRows(newRows);
      setFilteredRows(
        newRows.filter(
          (row) =>
            row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.clave.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      // Crear nuevo
      const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
      const newProfesor: Profesor = {
        id: nextId,
        clave: profesor.clave,
        nombre: profesor.nombre,
        apellidos: profesor.apellidos,
        carrera: profesor.carrera,
        activo: profesor.activo ?? true,
      };
      const newRows = [...rows, newProfesor];
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
            Gestión de Profesores
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            size="large"
          >
            Nuevo Profesor
          </Button>
        </Stack>

        {/* Barra de búsqueda */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar por clave, nombre, apellidos o carrera..."
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
          <Table sx={{ minWidth: 650 }} aria-label="tabla de profesores">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Clave
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Apellidos
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Carrera
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Estado
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
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron profesores
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => (
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
                    <TableCell>{row.apellidos}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.carrera || "N/A"}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.activo ? "Activo" : "Inactivo"}
                        size="small"
                        color={row.activo ? "success" : "default"}
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
                ))
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

        {/* Dialog de Profesor para crear/editar */}
        <ProfesorDialog
          open={open}
          initial={editing ?? undefined}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />

        {/* Dialog de detalle del profesor */}
        <ProfesorDetailDialog
          open={detailOpen}
          profesor={viewingProfesor}
          onClose={() => setDetailOpen(false)}
        />
      </Container>
    </Protected>
  );
}

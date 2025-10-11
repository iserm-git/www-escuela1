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
import MateriaDialog from "@/components/MateriaDialog";
import MateriaDetailDialog from "@/components/MateriaDetailDialog";

type Materia = {
  id: number;
  clave: string;
  nombre: string;
  creditos: number;
  carrera?: string;
};

// Datos mock - reemplazar con llamada a API
const INITIAL_DATA: Materia[] = [
  {
    id: 1,
    clave: "ACD-0908",
    nombre: "Taller de Investigación I",
    creditos: 4,
    carrera: "ISC",
  },
  {
    id: 2,
    clave: "AED-1285",
    nombre: "Desarrollo Sustentable",
    creditos: 5,
    carrera: "ISC",
  },
  {
    id: 3,
    clave: "SCC-1007",
    nombre: "Programación Orientada a Objetos",
    creditos: 5,
    carrera: "ISC",
  },
  {
    id: 4,
    clave: "SCD-1015",
    nombre: "Estructura de Datos",
    creditos: 5,
    carrera: "ISC",
  },
  {
    id: 5,
    clave: "SCH-1024",
    nombre: "Fundamentos de Bases de Datos",
    creditos: 5,
    carrera: "ISC",
  },
  {
    id: 6,
    clave: "SCD-1008",
    nombre: "Programación Web",
    creditos: 5,
    carrera: "ITIC",
  },
  {
    id: 7,
    clave: "ACA-0907",
    nombre: "Taller de Administración",
    creditos: 4,
    carrera: "IIND",
  },
  {
    id: 8,
    clave: "ACC-0906",
    nombre: "Fundamentos de Investigación",
    creditos: 4,
    carrera: "CP",
  },
  {
    id: 9,
    clave: "SCD-1027",
    nombre: "Sistemas Operativos",
    creditos: 5,
    carrera: "ISC",
  },
  {
    id: 10,
    clave: "SCG-1009",
    nombre: "Redes de Computadoras",
    creditos: 5,
    carrera: "ITIC",
  },
];

export default function MateriasPage() {
  const [rows, setRows] = useState<Materia[]>(INITIAL_DATA);
  const [filteredRows, setFilteredRows] = useState<Materia[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog de edición/creación
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Materia | null>(null);

  // Dialog de detalle
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingMateria, setViewingMateria] = useState<Materia | null>(null);

  // Manejo de búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = rows.filter(
      (row) =>
        row.nombre.toLowerCase().includes(value.toLowerCase()) ||
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

  const handleEdit = (materia: Materia) => {
    setEditing(materia);
    setOpen(true);
  };

  const handleViewDetail = (materia: Materia) => {
    setViewingMateria(materia);
    setDetailOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta materia?")) {
      const newRows = rows.filter((r) => r.id !== id);
      setRows(newRows);
      setFilteredRows(
        newRows.filter(
          (row) =>
            row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.carrera?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleSave = (
    materia: Partial<Materia> & {
      clave: string;
      nombre: string;
      creditos: number;
    }
  ) => {
    if (materia.id) {
      // Editar
      const newRows = rows.map((r) =>
        r.id === materia.id ? ({ ...r, ...materia } as Materia) : r
      );
      setRows(newRows);
      setFilteredRows(
        newRows.filter(
          (row) =>
            row.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.carrera?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      // Crear nuevo
      const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
      const newMateria: Materia = {
        id: nextId,
        clave: materia.clave,
        nombre: materia.nombre,
        creditos: materia.creditos,
        carrera: materia.carrera,
      };
      const newRows = [...rows, newMateria];
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
            Gestión de Materias
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            size="large"
          >
            Nueva Materia
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
          <Table sx={{ minWidth: 650 }} aria-label="tabla de materias">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Clave
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Créditos
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Carrera
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
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron materias
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
                    <TableCell>
                      <Chip
                        label={row.creditos}
                        size="small"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.carrera || "General"}
                        size="small"
                        color="primary"
                        variant="outlined"
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

        {/* Dialog de Materia para crear/editar */}
        <MateriaDialog
          open={open}
          initial={editing ?? undefined}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />

        {/* Dialog de detalle de la materia */}
        <MateriaDetailDialog
          open={detailOpen}
          materia={viewingMateria}
          onClose={() => setDetailOpen(false)}
        />
      </Container>
    </Protected>
  );
}

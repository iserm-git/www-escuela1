"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";

// Íconos
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import Protected from "@/components/Protected";

// Tipos (temporal - luego mover a types/reportes.types.ts)
interface Grupo {
  id: number;
  nombre: string;
  materia: string;
  profesor: string;
  totalAlumnos: number;
  porcentajeAsistencia: number;
}

interface Alumno {
  id: number;
  matricula: string;
  nombre: string;
  carrera: string;
  porcentajeAsistencia: number;
}

interface Periodo {
  id: number;
  clave: string;
  nombre: string;
}

export default function AsistenciasPage() {
  const router = useRouter();
  const [tipoReporte, setTipoReporte] = useState<"grupo" | "alumno">("grupo");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<number>(1);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock data - Reemplazar con llamadas a API
  const periodos: Periodo[] = [
    { id: 1, clave: "2025-1", nombre: "Enero - Junio 2025" },
    { id: 2, clave: "2024-2", nombre: "Agosto - Diciembre 2024" },
    { id: 3, clave: "2024-1", nombre: "Enero - Junio 2024" },
  ];

  const gruposMock: Grupo[] = [
    {
      id: 1,
      nombre: "1A",
      materia: "Programación I",
      profesor: "Juan Pérez García",
      totalAlumnos: 30,
      porcentajeAsistencia: 92,
    },
    {
      id: 2,
      nombre: "3B",
      materia: "Bases de Datos",
      profesor: "María López Hernández",
      totalAlumnos: 28,
      porcentajeAsistencia: 88,
    },
    {
      id: 3,
      nombre: "5A",
      materia: "Desarrollo Web",
      profesor: "Carlos Ramírez Soto",
      totalAlumnos: 25,
      porcentajeAsistencia: 95,
    },
    {
      id: 4,
      nombre: "2C",
      materia: "Estructura de Datos",
      profesor: "Ana Martínez Cruz",
      totalAlumnos: 32,
      porcentajeAsistencia: 85,
    },
  ];

  const alumnosMock: Alumno[] = [
    {
      id: 1,
      matricula: "20240001",
      nombre: "Pedro Sánchez López",
      carrera: "ISC",
      porcentajeAsistencia: 94,
    },
    {
      id: 2,
      matricula: "20240002",
      nombre: "Laura Gómez Díaz",
      carrera: "ITIC",
      porcentajeAsistencia: 88,
    },
    {
      id: 3,
      matricula: "20240003",
      nombre: "José Hernández Ruiz",
      carrera: "ISC",
      porcentajeAsistencia: 91,
    },
    {
      id: 4,
      matricula: "20240004",
      nombre: "Carmen Rodríguez Flores",
      carrera: "IIND",
      porcentajeAsistencia: 78,
    },
  ];

  // Filtrar datos según búsqueda
  const gruposFiltrados = gruposMock.filter(
    (grupo) =>
      grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      grupo.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
      grupo.profesor.toLowerCase().includes(busqueda.toLowerCase())
  );

  const alumnosFiltrados = alumnosMock.filter(
    (alumno) =>
      alumno.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.carrera.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleTipoReporteChange = (
    _event: React.MouseEvent<HTMLElement>,
    nuevoTipo: "grupo" | "alumno" | null
  ) => {
    if (nuevoTipo !== null) {
      setTipoReporte(nuevoTipo);
      setBusqueda(""); // Limpiar búsqueda al cambiar tipo
    }
  };

  const handleVerReporte = (id: number) => {
    const ruta =
      tipoReporte === "grupo"
        ? `/reportes/asistencias/grupo/${id}`
        : `/reportes/asistencias/alumno/${id}`;
    router.push(ruta);
  };

  const obtenerColorAsistencia = (
    porcentaje: number
  ): "success" | "warning" | "error" => {
    if (porcentaje >= 90) return "success";
    if (porcentaje >= 80) return "warning";
    return "error";
  };

  return (
    <Protected>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <AssignmentIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h4" fontWeight="bold">
              Reportes de Asistencias
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Consulta reportes de asistencia por grupo o alumno individual
          </Typography>
        </Box>

        {/* Selector de tipo de reporte */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tipo de Reporte
            </Typography>
            <ToggleButtonGroup
              value={tipoReporte}
              exclusive
              onChange={handleTipoReporteChange}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton value="grupo">
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupsIcon />
                  <span>Por Grupo</span>
                </Stack>
              </ToggleButton>
              <ToggleButton value="alumno">
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon />
                  <span>Por Alumno</span>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Filtros */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Periodo Lectivo"
                  value={periodoSeleccionado}
                  onChange={(e) =>
                    setPeriodoSeleccionado(Number(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {periodos.map((periodo) => (
                    <MenuItem key={periodo.id} value={periodo.id}>
                      {periodo.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={`Buscar ${
                    tipoReporte === "grupo" ? "grupo" : "alumno"
                  }`}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder={
                    tipoReporte === "grupo"
                      ? "Nombre, materia o profesor..."
                      : "Matrícula, nombre o carrera..."
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabla de resultados */}
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight="bold">
                {tipoReporte === "grupo"
                  ? `Grupos (${gruposFiltrados.length})`
                  : `Alumnos (${alumnosFiltrados.length})`}
              </Typography>
              <Chip
                icon={<FilterListIcon />}
                label={
                  periodos.find((p) => p.id === periodoSeleccionado)?.clave
                }
                color="primary"
                variant="outlined"
              />
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : tipoReporte === "grupo" ? (
              // Tabla de Grupos
              gruposFiltrados.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Grupo</TableCell>
                        <TableCell>Materia</TableCell>
                        <TableCell>Profesor</TableCell>
                        <TableCell align="center">Alumnos</TableCell>
                        <TableCell align="center">Asistencia</TableCell>
                        <TableCell align="center">Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gruposFiltrados.map((grupo) => (
                        <TableRow key={grupo.id} hover>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {grupo.nombre}
                            </Typography>
                          </TableCell>
                          <TableCell>{grupo.materia}</TableCell>
                          <TableCell>{grupo.profesor}</TableCell>
                          <TableCell align="center">
                            {grupo.totalAlumnos}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${grupo.porcentajeAsistencia}%`}
                              color={obtenerColorAsistencia(
                                grupo.porcentajeAsistencia
                              )}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleVerReporte(grupo.id)}
                            >
                              Ver Reporte
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No se encontraron grupos con los criterios de búsqueda
                </Alert>
              )
            ) : // Tabla de Alumnos
            alumnosFiltrados.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Matrícula</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Carrera</TableCell>
                      <TableCell align="center">Asistencia</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alumnosFiltrados.map((alumno) => (
                      <TableRow key={alumno.id} hover>
                        <TableCell>
                          <Typography fontWeight="bold">
                            {alumno.matricula}
                          </Typography>
                        </TableCell>
                        <TableCell>{alumno.nombre}</TableCell>
                        <TableCell>{alumno.carrera}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${alumno.porcentajeAsistencia}%`}
                            color={obtenerColorAsistencia(
                              alumno.porcentajeAsistencia
                            )}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleVerReporte(alumno.id)}
                          >
                            Ver Reporte
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No se encontraron alumnos con los criterios de búsqueda
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Protected>
  );
}

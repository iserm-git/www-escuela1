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
  Button,
  TextField,
  MenuItem,
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
  IconButton,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";

// Íconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WarningIcon from "@mui/icons-material/Warning";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Protected from "@/components/Protected";

// Tipos
interface AlumnoHistorial {
  id: number;
  matricula: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  carrera: string;
  semestre: number;
  promedioGeneral: number;
  creditosAcumulados: number;
  creditosTotales: number;
  materiasAprobadas: number;
  materiasReprobadas: number;
  materiasActuales: number;
  tendencia: "up" | "down" | "flat";
  estatus: "regular" | "irregular" | "excelente";
}

interface Carrera {
  id: number;
  clave: string;
  nombre: string;
}

export default function HistorialAlumnosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<number>(0);
  const [estatusSeleccionado, setEstatusSeleccionado] =
    useState<string>("todos");

  // Mock data
  const carreras: Carrera[] = [
    { id: 0, clave: "TODAS", nombre: "Todas las carreras" },
    { id: 1, clave: "ISC", nombre: "Ing. en Sistemas Computacionales" },
    { id: 2, clave: "ITIC", nombre: "Ing. en Tecnologías de Información" },
    { id: 3, clave: "IIND", nombre: "Ing. Industrial" },
    { id: 4, clave: "IGE", nombre: "Ing. en Gestión Empresarial" },
  ];

  const estatusOptions = [
    { value: "todos", label: "Todos los estatus" },
    { value: "excelente", label: "Excelente (≥9.0)" },
    { value: "regular", label: "Regular (7.0-8.9)" },
    { value: "irregular", label: "Irregular (<7.0)" },
  ];

  const alumnosMock: AlumnoHistorial[] = [
    {
      id: 1,
      matricula: "20240001",
      nombre: "Pedro",
      apellidoPaterno: "Sánchez",
      apellidoMaterno: "López",
      carrera: "ISC",
      semestre: 5,
      promedioGeneral: 9.2,
      creditosAcumulados: 180,
      creditosTotales: 250,
      materiasAprobadas: 25,
      materiasReprobadas: 0,
      materiasActuales: 6,
      tendencia: "up",
      estatus: "excelente",
    },
    {
      id: 2,
      matricula: "20240002",
      nombre: "Laura",
      apellidoPaterno: "Gómez",
      apellidoMaterno: "Díaz",
      carrera: "ISC",
      semestre: 3,
      promedioGeneral: 8.5,
      creditosAcumulados: 110,
      creditosTotales: 250,
      materiasAprobadas: 15,
      materiasReprobadas: 1,
      materiasActuales: 7,
      tendencia: "up",
      estatus: "regular",
    },
    {
      id: 3,
      matricula: "20240003",
      nombre: "José",
      apellidoPaterno: "Hernández",
      apellidoMaterno: "Ruiz",
      carrera: "ITIC",
      semestre: 7,
      promedioGeneral: 9.5,
      creditosAcumulados: 220,
      creditosTotales: 260,
      materiasAprobadas: 32,
      materiasReprobadas: 0,
      materiasActuales: 5,
      tendencia: "up",
      estatus: "excelente",
    },
    {
      id: 4,
      matricula: "20240004",
      nombre: "Carmen",
      apellidoPaterno: "Rodríguez",
      apellidoMaterno: "Flores",
      carrera: "ISC",
      semestre: 4,
      promedioGeneral: 6.8,
      creditosAcumulados: 130,
      creditosTotales: 250,
      materiasAprobadas: 18,
      materiasReprobadas: 4,
      materiasActuales: 6,
      tendencia: "down",
      estatus: "irregular",
    },
    {
      id: 5,
      matricula: "20240005",
      nombre: "Miguel Ángel",
      apellidoPaterno: "Torres",
      apellidoMaterno: "Méndez",
      carrera: "ITIC",
      semestre: 6,
      promedioGeneral: 8.8,
      creditosAcumulados: 200,
      creditosTotales: 260,
      materiasAprobadas: 28,
      materiasReprobadas: 1,
      materiasActuales: 6,
      tendencia: "flat",
      estatus: "regular",
    },
    {
      id: 6,
      matricula: "20240006",
      nombre: "Ana María",
      apellidoPaterno: "Jiménez",
      apellidoMaterno: "Castro",
      carrera: "IIND",
      semestre: 2,
      promedioGeneral: 7.5,
      creditosAcumulados: 60,
      creditosTotales: 240,
      materiasAprobadas: 8,
      materiasReprobadas: 2,
      materiasActuales: 7,
      tendencia: "flat",
      estatus: "regular",
    },
    {
      id: 7,
      matricula: "20240007",
      nombre: "Roberto",
      apellidoPaterno: "Martínez",
      apellidoMaterno: "Silva",
      carrera: "IGE",
      semestre: 8,
      promedioGeneral: 9.1,
      creditosAcumulados: 240,
      creditosTotales: 230,
      materiasAprobadas: 36,
      materiasReprobadas: 0,
      materiasActuales: 4,
      tendencia: "up",
      estatus: "excelente",
    },
  ];

  // Filtrar alumnos
  const alumnosFiltrados = alumnosMock.filter((alumno) => {
    const cumpleBusqueda =
      alumno.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
      `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const cumpleCarrera =
      carreraSeleccionada === 0 ||
      alumno.carrera ===
        carreras.find((c) => c.id === carreraSeleccionada)?.clave;

    const cumpleEstatus =
      estatusSeleccionado === "todos" || alumno.estatus === estatusSeleccionado;

    return cumpleBusqueda && cumpleCarrera && cumpleEstatus;
  });

  // Calcular estadísticas generales
  const promedioGeneral =
    alumnosFiltrados.length > 0
      ? (
          alumnosFiltrados.reduce((sum, a) => sum + a.promedioGeneral, 0) /
          alumnosFiltrados.length
        ).toFixed(2)
      : "0.00";

  const alumnosExcelentes = alumnosFiltrados.filter(
    (a) => a.estatus === "excelente"
  ).length;
  const alumnosRegulares = alumnosFiltrados.filter(
    (a) => a.estatus === "regular"
  ).length;
  const alumnosIrregulares = alumnosFiltrados.filter(
    (a) => a.estatus === "irregular"
  ).length;

  const totalMaterias = alumnosFiltrados.reduce(
    (sum, a) => sum + a.materiasAprobadas + a.materiasReprobadas,
    0
  );
  const totalAprobadas = alumnosFiltrados.reduce(
    (sum, a) => sum + a.materiasAprobadas,
    0
  );
  const tasaAprobacionGlobal =
    totalMaterias > 0 ? Math.round((totalAprobadas / totalMaterias) * 100) : 0;

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const handleVolver = () => {
    router.push("/reportes");
  };

  const handleVerHistorial = (alumnoId: number) => {
    router.push(`/reportes/alumnos/${alumnoId}`);
  };

  const obtenerColorPromedio = (
    promedio: number
  ): "success" | "info" | "warning" | "error" => {
    if (promedio >= 9) return "success";
    if (promedio >= 8) return "info";
    if (promedio >= 7) return "warning";
    return "error";
  };

  const obtenerColorEstatus = (
    estatus: string
  ): "success" | "warning" | "error" | "default" => {
    switch (estatus) {
      case "excelente":
        return "success";
      case "regular":
        return "warning";
      case "irregular":
        return "error";
      default:
        return "default";
    }
  };

  const obtenerIconoTendencia = (tendencia: "up" | "down" | "flat") => {
    switch (tendencia) {
      case "up":
        return <TrendingUpIcon fontSize="small" color="success" />;
      case "down":
        return <TrendingDownIcon fontSize="small" color="error" />;
      case "flat":
        return (
          <TrendingUpIcon
            fontSize="small"
            color="action"
            sx={{ transform: "rotate(90deg)" }}
          />
        );
    }
  };

  const calcularAvance = (acumulados: number, totales: number): number => {
    return Math.round((acumulados / totales) * 100);
  };

  return (
    <Protected>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleVolver}
            sx={{ mb: 2 }}
          >
            Volver a Reportes
          </Button>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <HistoryEduIcon sx={{ fontSize: 36, color: "secondary.main" }} />
            <Typography variant="h4" fontWeight="bold">
              Historial Académico de Alumnos
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Busca y consulta el historial académico completo de cualquier alumno
          </Typography>
        </Box>

        {/* Tarjetas de resumen */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <PersonIcon sx={{ fontSize: 32, color: "primary.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {alumnosFiltrados.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Alumnos
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h5" fontWeight="bold">
                    {promedioGeneral}
                  </Typography>
                  <Typography variant="body2" align="center">
                    Promedio General
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <EmojiEventsIcon
                    sx={{ fontSize: 32, color: "warning.main" }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {alumnosExcelentes}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Excelentes (≥9.0)
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <WarningIcon sx={{ fontSize: 32, color: "error.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {alumnosIrregulares}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Irregulares (&lt;7.0)
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <GroupsIcon sx={{ fontSize: 32, color: "info.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {alumnosRegulares}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Regulares (7.0-8.9)
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <CheckCircleIcon
                    sx={{ fontSize: 32, color: "success.main" }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {totalAprobadas}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Materias Aprobadas
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {tasaAprobacionGlobal}%
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Tasa Aprobación
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <FilterListIcon />
              <Typography variant="h6" fontWeight="bold">
                Filtros de Búsqueda
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Carrera"
                  value={carreraSeleccionada}
                  onChange={(e) =>
                    setCarreraSeleccionada(Number(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {carreras.map((carrera) => (
                    <MenuItem key={carrera.id} value={carrera.id}>
                      {carrera.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Estatus Académico"
                  value={estatusSeleccionado}
                  onChange={(e) => setEstatusSeleccionado(e.target.value)}
                >
                  {estatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Matrícula o nombre..."
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

        {/* Tabla de alumnos */}
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Lista de Alumnos ({alumnosFiltrados.length})
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : alumnosFiltrados.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Alumno</TableCell>
                      <TableCell>Matrícula</TableCell>
                      <TableCell>Carrera</TableCell>
                      <TableCell align="center">Semestre</TableCell>
                      <TableCell align="center">Promedio</TableCell>
                      <TableCell align="center">Créditos</TableCell>
                      <TableCell align="center">Materias</TableCell>
                      <TableCell align="center">Estatus</TableCell>
                      <TableCell align="center">Tendencia</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alumnosFiltrados.map((alumno) => (
                      <TableRow key={alumno.id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Avatar sx={{ bgcolor: "secondary.main" }}>
                              {alumno.nombre.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">
                                {`${alumno.nombre} ${alumno.apellidoPaterno}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {alumno.apellidoMaterno}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={alumno.matricula}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={alumno.carrera}
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`${alumno.semestre}°`} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={alumno.promedioGeneral.toFixed(1)}
                            color={obtenerColorPromedio(alumno.promedioGeneral)}
                            sx={{ fontWeight: "bold", minWidth: 60 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={`${calcularAvance(
                              alumno.creditosAcumulados,
                              alumno.creditosTotales
                            )}% de avance`}
                          >
                            <Typography variant="body2">
                              {alumno.creditosAcumulados}/
                              {alumno.creditosTotales}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                          >
                            <Chip
                              label={`✓${alumno.materiasAprobadas}`}
                              size="small"
                              color="success"
                            />
                            {alumno.materiasReprobadas > 0 && (
                              <Chip
                                label={`✗${alumno.materiasReprobadas}`}
                                size="small"
                                color="error"
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={alumno.estatus.toUpperCase()}
                            color={obtenerColorEstatus(alumno.estatus)}
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={
                              alumno.tendencia === "up"
                                ? "Mejorando"
                                : alumno.tendencia === "down"
                                ? "Disminuyendo"
                                : "Estable"
                            }
                          >
                            {obtenerIconoTendencia(alumno.tendencia)}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver historial completo">
                            <IconButton
                              color="primary"
                              onClick={() => handleVerHistorial(alumno.id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
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

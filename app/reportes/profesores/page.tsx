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
import { BarChart } from "@mui/x-charts/BarChart";

// Íconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WarningIcon from "@mui/icons-material/Warning";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupsIcon from "@mui/icons-material/Groups";

import Protected from "@/components/Protected";

// Tipos
interface RendimientoProfesor {
  id: number;
  claveEmpleado: string;
  nombre: string;
  carrera: string;
  gruposAsignados: number;
  totalAlumnos: number;
  promedioGlobal: number;
  tasaAprobacionPromedio: number;
  tendencia: "up" | "down" | "flat";
}

interface Periodo {
  id: number;
  clave: string;
  nombre: string;
}

interface Carrera {
  id: number;
  clave: string;
  nombre: string;
}

export default function EstadisticasProfesoresPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<number>(1);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<number>(0);

  // Mock data
  const periodos: Periodo[] = [
    { id: 1, clave: "2025-1", nombre: "Enero - Junio 2025" },
    { id: 2, clave: "2024-2", nombre: "Agosto - Diciembre 2024" },
    { id: 3, clave: "2024-1", nombre: "Enero - Junio 2024" },
  ];

  const carreras: Carrera[] = [
    { id: 0, clave: "TODAS", nombre: "Todas las carreras" },
    { id: 1, clave: "ISC", nombre: "Ing. en Sistemas Computacionales" },
    { id: 2, clave: "ITIC", nombre: "Ing. en Tecnologías de Información" },
    { id: 3, clave: "IIND", nombre: "Ing. Industrial" },
    { id: 4, clave: "IGE", nombre: "Ing. en Gestión Empresarial" },
  ];

  const profesoresMock: RendimientoProfesor[] = [
    {
      id: 1,
      claveEmpleado: "PROF001",
      nombre: "Juan Pérez García",
      carrera: "ISC",
      gruposAsignados: 3,
      totalAlumnos: 85,
      promedioGlobal: 8.7,
      tasaAprobacionPromedio: 94,
      tendencia: "up",
    },
    {
      id: 2,
      claveEmpleado: "PROF002",
      nombre: "María López Hernández",
      carrera: "ISC",
      gruposAsignados: 2,
      totalAlumnos: 56,
      promedioGlobal: 8.4,
      tasaAprobacionPromedio: 91,
      tendencia: "flat",
    },
    {
      id: 3,
      claveEmpleado: "PROF003",
      nombre: "Carlos Ramírez Soto",
      carrera: "ITIC",
      gruposAsignados: 4,
      totalAlumnos: 98,
      promedioGlobal: 9.1,
      tasaAprobacionPromedio: 97,
      tendencia: "up",
    },
    {
      id: 4,
      claveEmpleado: "PROF004",
      nombre: "Ana Martínez Cruz",
      carrera: "ISC",
      gruposAsignados: 2,
      totalAlumnos: 60,
      promedioGlobal: 7.9,
      tasaAprobacionPromedio: 85,
      tendencia: "down",
    },
    {
      id: 5,
      claveEmpleado: "PROF005",
      nombre: "Roberto Sánchez Díaz",
      carrera: "ITIC",
      gruposAsignados: 3,
      totalAlumnos: 78,
      promedioGlobal: 8.8,
      tasaAprobacionPromedio: 93,
      tendencia: "up",
    },
    {
      id: 6,
      claveEmpleado: "PROF006",
      nombre: "Laura Torres Méndez",
      carrera: "ITIC",
      gruposAsignados: 2,
      totalAlumnos: 52,
      promedioGlobal: 8.2,
      tasaAprobacionPromedio: 89,
      tendencia: "flat",
    },
    {
      id: 7,
      claveEmpleado: "PROF007",
      nombre: "Miguel Ángel Ruiz",
      carrera: "IIND",
      gruposAsignados: 3,
      totalAlumnos: 72,
      promedioGlobal: 8.5,
      tasaAprobacionPromedio: 92,
      tendencia: "up",
    },
  ];

  // Filtrar profesores
  const profesoresFiltrados = profesoresMock.filter((profesor) => {
    const cumpleBusqueda =
      profesor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      profesor.claveEmpleado.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleCarrera =
      carreraSeleccionada === 0 ||
      profesor.carrera ===
        carreras.find((c) => c.id === carreraSeleccionada)?.clave;

    return cumpleBusqueda && cumpleCarrera;
  });

  // Calcular estadísticas generales
  const promedioGeneral =
    profesoresFiltrados.length > 0
      ? (
          profesoresFiltrados.reduce((sum, p) => sum + p.promedioGlobal, 0) /
          profesoresFiltrados.length
        ).toFixed(2)
      : "0.00";

  const totalGrupos = profesoresFiltrados.reduce(
    (sum, p) => sum + p.gruposAsignados,
    0
  );
  const totalAlumnos = profesoresFiltrados.reduce(
    (sum, p) => sum + p.totalAlumnos,
    0
  );

  const tasaAprobacionGlobal =
    profesoresFiltrados.length > 0
      ? Math.round(
          profesoresFiltrados.reduce(
            (sum, p) => sum + p.tasaAprobacionPromedio,
            0
          ) / profesoresFiltrados.length
        )
      : 0;

  const profesoresExcelentes = profesoresFiltrados.filter(
    (p) => p.promedioGlobal >= 9
  ).length;
  const profesoresBajos = profesoresFiltrados.filter(
    (p) => p.promedioGlobal < 8
  ).length;

  // Top 5 profesores
  const top5Profesores = [...profesoresFiltrados]
    .sort((a, b) => b.promedioGlobal - a.promedioGlobal)
    .slice(0, 5);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    cargarDatos();
  }, [periodoSeleccionado]);

  const handleVolver = () => {
    router.push("/reportes");
  };

  const handleVerDetalle = (profesorId: number) => {
    router.push(`/reportes/profesores/${profesorId}`);
  };

  const obtenerColorPromedio = (
    promedio: number
  ): "success" | "info" | "warning" | "error" => {
    if (promedio >= 9) return "success";
    if (promedio >= 8) return "info";
    if (promedio >= 7) return "warning";
    return "error";
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

  // Datos para gráfico (Top 5)
  const nombresProfesoresGrafico = top5Profesores.map((p) =>
    p.nombre.split(" ").slice(0, 2).join(" ")
  );
  const promediosGrafico = top5Profesores.map((p) => p.promedioGlobal);

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
            <TimelineIcon sx={{ fontSize: 36, color: "warning.main" }} />
            <Typography variant="h4" fontWeight="bold">
              Estadísticas de Profesores
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Rendimiento académico y desempeño docente por periodo
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
                    {profesoresFiltrados.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Profesores
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card sx={{ bgcolor: "warning.main", color: "white" }}>
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
                    {profesoresExcelentes}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Profesores ≥9.0
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
                    {profesoresBajos}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Profesores &lt;8.0
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
                    {totalGrupos}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Total Grupos
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <SchoolIcon sx={{ fontSize: 32, color: "info.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {totalAlumnos}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Total Alumnos
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

        {/* Gráfico comparativo */}
        {top5Profesores.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top 5 Profesores con Mejor Promedio
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: "100%", height: 300 }}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: nombresProfesoresGrafico,
                    },
                  ]}
                  series={[
                    {
                      data: promediosGrafico,
                      label: "Promedio",
                      color: "#ed6c02",
                    },
                  ]}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        )}

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
                Filtros
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
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

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Carrera"
                  value={carreraSeleccionada}
                  onChange={(e) =>
                    setCarreraSeleccionada(Number(e.target.value))
                  }
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
                  fullWidth
                  label="Buscar"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre o clave..."
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

        {/* Tabla de profesores */}
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Lista de Profesores ({profesoresFiltrados.length})
              </Typography>
              <Chip
                icon={<CalendarTodayIcon />}
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
            ) : profesoresFiltrados.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Profesor</TableCell>
                      <TableCell>Clave</TableCell>
                      <TableCell>Carrera</TableCell>
                      <TableCell align="center">Grupos</TableCell>
                      <TableCell align="center">Alumnos</TableCell>
                      <TableCell align="center">Promedio</TableCell>
                      <TableCell align="center">Tasa Aprob.</TableCell>
                      <TableCell align="center">Tendencia</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profesoresFiltrados.map((profesor) => (
                      <TableRow key={profesor.id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Avatar sx={{ bgcolor: "warning.main" }}>
                              {profesor.nombre.charAt(0)}
                            </Avatar>
                            <Typography fontWeight="bold">
                              {profesor.nombre}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={profesor.claveEmpleado}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={profesor.carrera}
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {profesor.gruposAsignados}
                        </TableCell>
                        <TableCell align="center">
                          {profesor.totalAlumnos}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={profesor.promedioGlobal.toFixed(1)}
                            color={obtenerColorPromedio(
                              profesor.promedioGlobal
                            )}
                            sx={{ fontWeight: "bold", minWidth: 60 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${profesor.tasaAprobacionPromedio}%`}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={
                              profesor.tendencia === "up"
                                ? "Mejorando"
                                : profesor.tendencia === "down"
                                ? "Disminuyendo"
                                : "Estable"
                            }
                          >
                            {obtenerIconoTendencia(profesor.tendencia)}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalle">
                            <IconButton
                              color="primary"
                              onClick={() => handleVerDetalle(profesor.id)}
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
                No se encontraron profesores con los criterios de búsqueda
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Protected>
  );
}

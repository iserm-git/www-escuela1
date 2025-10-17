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
  Divider,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

// Íconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WarningIcon from "@mui/icons-material/Warning";
import BarChartIcon from "@mui/icons-material/BarChart";

import Protected from "@/components/Protected";

// Tipos
interface EstadisticaGrupo {
  id: number;
  nombre: string;
  materia: string;
  profesor: string;
  carrera: string;
  totalAlumnos: number;
  promedioGeneral: number;
  aprobados: number;
  reprobados: number;
  tasaAprobacion: number;
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

export default function EstadisticasGruposPage() {
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

  const gruposMock: EstadisticaGrupo[] = [
    {
      id: 1,
      nombre: "1A",
      materia: "Programación I",
      profesor: "Juan Pérez García",
      carrera: "ISC",
      totalAlumnos: 30,
      promedioGeneral: 8.5,
      aprobados: 28,
      reprobados: 2,
      tasaAprobacion: 93,
      tendencia: "up",
    },
    {
      id: 2,
      nombre: "3B",
      materia: "Bases de Datos",
      profesor: "María López Hernández",
      carrera: "ISC",
      totalAlumnos: 28,
      promedioGeneral: 8.2,
      aprobados: 26,
      reprobados: 2,
      tasaAprobacion: 93,
      tendencia: "flat",
    },
    {
      id: 3,
      nombre: "5A",
      materia: "Desarrollo Web",
      profesor: "Carlos Ramírez Soto",
      carrera: "ITIC",
      totalAlumnos: 25,
      promedioGeneral: 9.1,
      aprobados: 25,
      reprobados: 0,
      tasaAprobacion: 100,
      tendencia: "up",
    },
    {
      id: 4,
      nombre: "2C",
      materia: "Estructura de Datos",
      profesor: "Ana Martínez Cruz",
      carrera: "ISC",
      totalAlumnos: 32,
      promedioGeneral: 7.8,
      aprobados: 27,
      reprobados: 5,
      tasaAprobacion: 84,
      tendencia: "down",
    },
    {
      id: 5,
      nombre: "4B",
      materia: "Ingeniería de Software",
      profesor: "Roberto Sánchez Díaz",
      carrera: "ITIC",
      totalAlumnos: 27,
      promedioGeneral: 8.7,
      aprobados: 26,
      reprobados: 1,
      tasaAprobacion: 96,
      tendencia: "up",
    },
    {
      id: 6,
      nombre: "6A",
      materia: "Redes de Computadoras",
      profesor: "Laura Torres Méndez",
      carrera: "ITIC",
      totalAlumnos: 24,
      promedioGeneral: 8.0,
      aprobados: 22,
      reprobados: 2,
      tasaAprobacion: 92,
      tendencia: "flat",
    },
  ];

  // Filtrar grupos
  const gruposFiltrados = gruposMock.filter((grupo) => {
    const cumpleBusqueda =
      grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      grupo.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
      grupo.profesor.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleCarrera =
      carreraSeleccionada === 0 ||
      grupo.carrera ===
        carreras.find((c) => c.id === carreraSeleccionada)?.clave;

    return cumpleBusqueda && cumpleCarrera;
  });

  // Calcular estadísticas generales
  const promedioGeneral =
    gruposFiltrados.length > 0
      ? (
          gruposFiltrados.reduce((sum, g) => sum + g.promedioGeneral, 0) /
          gruposFiltrados.length
        ).toFixed(2)
      : "0.00";

  const totalAlumnos = gruposFiltrados.reduce(
    (sum, g) => sum + g.totalAlumnos,
    0
  );
  const totalAprobados = gruposFiltrados.reduce(
    (sum, g) => sum + g.aprobados,
    0
  );
  const totalReprobados = gruposFiltrados.reduce(
    (sum, g) => sum + g.reprobados,
    0
  );
  const tasaAprobacionGlobal =
    totalAlumnos > 0 ? Math.round((totalAprobados / totalAlumnos) * 100) : 0;

  const gruposExcelentes = gruposFiltrados.filter(
    (g) => g.promedioGeneral >= 9
  ).length;
  const gruposBajos = gruposFiltrados.filter(
    (g) => g.promedioGeneral < 7
  ).length;

  // Grupos ordenados por promedio (top 5)
  const top5Grupos = [...gruposFiltrados]
    .sort((a, b) => b.promedioGeneral - a.promedioGeneral)
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

  const handleVerDetalle = (grupoId: number) => {
    router.push(`/reportes/grupos/${grupoId}`);
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

  // Datos para gráfico de barras (Top 5)
  const nombresGruposGrafico = top5Grupos.map(
    (g) => `${g.nombre} - ${g.materia}`
  );
  const promediosGrafico = top5Grupos.map((g) => g.promedioGeneral);

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
            <BarChartIcon sx={{ fontSize: 36, color: "success.main" }} />
            <Typography variant="h4" fontWeight="bold">
              Estadísticas de Grupos
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Promedios generales y métricas de rendimiento académico por grupo
          </Typography>
        </Box>

        {/* Tarjetas de resumen */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <GroupsIcon sx={{ fontSize: 32, color: "primary.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {gruposFiltrados.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Grupos
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card sx={{ bgcolor: "success.main", color: "white" }}>
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
                    {gruposExcelentes}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Grupos ≥9.0
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
                    {gruposBajos}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Grupos &lt;7.0
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
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

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {totalAprobados}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Aprobados
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {totalReprobados}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Reprobados
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
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
        {top5Grupos.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top 5 Grupos con Mejor Promedio
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: "100%", height: 300 }}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: nombresGruposGrafico,
                    },
                  ]}
                  series={[
                    {
                      data: promediosGrafico,
                      label: "Promedio",
                      color: "#2e7d32",
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
                  placeholder="Grupo, materia o profesor..."
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

        {/* Tabla de grupos */}
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Lista de Grupos ({gruposFiltrados.length})
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
            ) : gruposFiltrados.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Grupo</TableCell>
                      <TableCell>Materia</TableCell>
                      <TableCell>Profesor</TableCell>
                      <TableCell>Carrera</TableCell>
                      <TableCell align="center">Alumnos</TableCell>
                      <TableCell align="center">Promedio</TableCell>
                      <TableCell align="center">Aprobados</TableCell>
                      <TableCell align="center">Reprobados</TableCell>
                      <TableCell align="center">Tasa Aprob.</TableCell>
                      <TableCell align="center">Tendencia</TableCell>
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
                        <TableCell>
                          <Chip
                            label={grupo.carrera}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {grupo.totalAlumnos}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={grupo.promedioGeneral.toFixed(1)}
                            color={obtenerColorPromedio(grupo.promedioGeneral)}
                            size="small"
                            sx={{ fontWeight: "bold", minWidth: 60 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={grupo.aprobados}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={grupo.reprobados}
                            color="error"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {grupo.tasaAprobacion}%
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={
                              grupo.tendencia === "up"
                                ? "Mejorando"
                                : grupo.tendencia === "down"
                                ? "Disminuyendo"
                                : "Estable"
                            }
                          >
                            {obtenerIconoTendencia(grupo.tendencia)}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalle">
                            <IconButton
                              color="primary"
                              onClick={() => handleVerDetalle(grupo.id)}
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
                No se encontraron grupos con los criterios de búsqueda
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Protected>
  );
}

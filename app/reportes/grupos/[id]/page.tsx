"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
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
  Divider,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

// Íconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import Protected from "@/components/Protected";

// Tipos
interface GrupoInfo {
  id: number;
  nombre: string;
  materia: string;
  profesor: string;
  carrera: string;
  periodo: string;
  grado: string;
  turno: string;
  totalAlumnos: number;
}

interface EstadisticasGrupo {
  promedioGeneral: number;
  promedioMasAlto: number;
  promedioMasBajo: number;
  aprobados: number;
  reprobados: number;
  tasaAprobacion: number;
  calificacionModa: number;
}

interface AlumnoCalificacion {
  id: number;
  matricula: string;
  nombre: string;
  calificacionFinal: number;
  parcial1: number;
  parcial2: number;
  parcial3: number;
  estado: "aprobado" | "reprobado" | "cursando";
}

interface DistribucionCalificaciones {
  rango: string;
  cantidad: number;
  porcentaje: number;
}

export default function DetalleGrupoPage() {
  const params = useParams();
  const router = useRouter();
  const grupoId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const grupoInfo: GrupoInfo = {
    id: Number(grupoId),
    nombre: "1A",
    materia: "Programación I",
    profesor: "Juan Pérez García",
    carrera: "ISC",
    periodo: "Enero - Junio 2025",
    grado: "1",
    turno: "Matutino",
    totalAlumnos: 6,
  };

  const estadisticas: EstadisticasGrupo = {
    promedioGeneral: 8.5,
    promedioMasAlto: 9.8,
    promedioMasBajo: 7.2,
    aprobados: 5,
    reprobados: 1,
    tasaAprobacion: 83,
    calificacionModa: 8.5,
  };

  const alumnosCalificaciones: AlumnoCalificacion[] = [
    {
      id: 1,
      matricula: "20240001",
      nombre: "Pedro Sánchez López",
      calificacionFinal: 9.8,
      parcial1: 9.5,
      parcial2: 10.0,
      parcial3: 9.8,
      estado: "aprobado",
    },
    {
      id: 2,
      matricula: "20240002",
      nombre: "Laura Gómez Díaz",
      calificacionFinal: 8.7,
      parcial1: 8.5,
      parcial2: 8.8,
      parcial3: 8.8,
      estado: "aprobado",
    },
    {
      id: 3,
      matricula: "20240003",
      nombre: "José Hernández Ruiz",
      calificacionFinal: 8.5,
      parcial1: 8.0,
      parcial2: 8.7,
      parcial3: 8.8,
      estado: "aprobado",
    },
    {
      id: 4,
      matricula: "20240004",
      nombre: "Carmen Rodríguez Flores",
      calificacionFinal: 7.2,
      parcial1: 7.0,
      parcial2: 7.2,
      parcial3: 7.5,
      estado: "aprobado",
    },
    {
      id: 5,
      matricula: "20240005",
      nombre: "Miguel Ángel Torres",
      calificacionFinal: 9.2,
      parcial1: 9.0,
      parcial2: 9.3,
      parcial3: 9.3,
      estado: "aprobado",
    },
    {
      id: 6,
      matricula: "20240006",
      nombre: "Ana María Jiménez",
      calificacionFinal: 5.8,
      parcial1: 6.0,
      parcial2: 5.5,
      parcial3: 6.0,
      estado: "reprobado",
    },
  ];

  const distribucionCalificaciones: DistribucionCalificaciones[] = [
    { rango: "10", cantidad: 0, porcentaje: 0 },
    { rango: "9-9.9", cantidad: 2, porcentaje: 33 },
    { rango: "8-8.9", cantidad: 2, porcentaje: 33 },
    { rango: "7-7.9", cantidad: 1, porcentaje: 17 },
    { rango: "6-6.9", cantidad: 0, porcentaje: 0 },
    { rango: "<6", cantidad: 1, porcentaje: 17 },
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Aquí irían las llamadas a tu API
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };
    cargarDatos();
  }, [grupoId]);

  const handleVolver = () => {
    router.push("/reportes/grupos");
  };

  const handleExportarPDF = () => {
    console.log("Exportar a PDF");
  };

  const handleExportarExcel = () => {
    console.log("Exportar a Excel");
  };

  const obtenerColorCalificacion = (
    calificacion: number
  ): "success" | "info" | "warning" | "error" => {
    if (calificacion >= 9) return "success";
    if (calificacion >= 8) return "info";
    if (calificacion >= 7) return "warning";
    return "error";
  };

  const obtenerColorEstado = (
    estado: string
  ): "success" | "error" | "default" => {
    switch (estado) {
      case "aprobado":
        return "success";
      case "reprobado":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Protected>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Protected>
    );
  }

  if (error) {
    return (
      <Protected>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Protected>
    );
  }

  // Datos para gráfico de barras (Calificaciones por alumno)
  const nombresAlumnos = alumnosCalificaciones.map(
    (a) => a.nombre.split(" ")[0]
  );
  const calificacionesAlumnos = alumnosCalificaciones.map(
    (a) => a.calificacionFinal
  );

  // Datos para gráfico de pastel (Distribución)
  const dataPieChart = distribucionCalificaciones
    .filter((d) => d.cantidad > 0)
    .map((d, index) => ({
      id: index,
      value: d.cantidad,
      label: `${d.rango} (${d.cantidad})`,
    }));

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
            Volver a Estadísticas de Grupos
          </Button>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <GroupsIcon sx={{ fontSize: 36, color: "success.main" }} />
                <Typography variant="h4" fontWeight="bold">
                  Grupo {grupoInfo.nombre} - {grupoInfo.materia}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={grupoInfo.periodo}
                  variant="outlined"
                />
                <Chip
                  icon={<SchoolIcon />}
                  label={grupoInfo.carrera}
                  color="primary"
                />
                <Chip
                  icon={<PersonIcon />}
                  label={grupoInfo.profesor}
                  variant="outlined"
                />
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label={`Grado: ${grupoInfo.grado}`} size="small" />
                <Chip label={`Turno: ${grupoInfo.turno}`} size="small" />
                <Chip
                  label={`${grupoInfo.totalAlumnos} alumnos`}
                  size="small"
                />
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Exportar a PDF">
                <IconButton color="error" onClick={handleExportarPDF}>
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exportar a Excel">
                <IconButton color="success" onClick={handleExportarExcel}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ bgcolor: "success.main", color: "white" }}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.promedioGeneral.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" align="center">
                    Promedio General
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <EmojiEventsIcon
                    sx={{ fontSize: 32, color: "warning.main" }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {estadisticas.promedioMasAlto.toFixed(1)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Más Alto
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <TrendingUpIcon sx={{ fontSize: 32, color: "info.main" }} />
                  <Typography variant="h6" fontWeight="bold">
                    {estadisticas.promedioMasBajo.toFixed(1)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Más Bajo
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <CheckCircleIcon
                    sx={{ fontSize: 32, color: "success.main" }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.aprobados}
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

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <CancelIcon sx={{ fontSize: 32, color: "error.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.reprobados}
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

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {estadisticas.tasaAprobacion}%
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Tasa Aprob.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Gráfico de barras */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Calificaciones por Alumno
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ width: "100%", height: 350 }}>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: nombresAlumnos,
                      },
                    ]}
                    yAxis={[
                      {
                        min: 0,
                        max: 10,
                      },
                    ]}
                    series={[
                      {
                        data: calificacionesAlumnos,
                        label: "Calificación Final",
                        color: "#2e7d32",
                      },
                    ]}
                    height={350}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de pastel */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Distribución de Calificaciones
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    width: "100%",
                    height: 350,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PieChart
                    series={[
                      {
                        data: dataPieChart,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                      },
                    ]}
                    height={350}
                    width={350}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de distribución */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Análisis de Distribución
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rango de Calificación</TableCell>
                    <TableCell align="center">Cantidad de Alumnos</TableCell>
                    <TableCell align="center">Porcentaje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {distribucionCalificaciones.map((dist, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography fontWeight="bold">{dist.rango}</Typography>
                      </TableCell>
                      <TableCell align="center">{dist.cantidad}</TableCell>
                      <TableCell align="center">
                        <Chip label={`${dist.porcentaje}%`} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Tabla de calificaciones por alumno */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Calificaciones Detalladas por Alumno
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Alumno</TableCell>
                    <TableCell align="center">Parcial 1</TableCell>
                    <TableCell align="center">Parcial 2</TableCell>
                    <TableCell align="center">Parcial 3</TableCell>
                    <TableCell align="center">Calificación Final</TableCell>
                    <TableCell align="center">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnosCalificaciones.map((alumno) => (
                    <TableRow key={alumno.id} hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {alumno.matricula}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "primary.main",
                            }}
                          >
                            {alumno.nombre.charAt(0)}
                          </Avatar>
                          <span>{alumno.nombre}</span>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.parcial1.toFixed(1)}
                          color={obtenerColorCalificacion(alumno.parcial1)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.parcial2.toFixed(1)}
                          color={obtenerColorCalificacion(alumno.parcial2)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.parcial3.toFixed(1)}
                          color={obtenerColorCalificacion(alumno.parcial3)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.calificacionFinal.toFixed(1)}
                          color={obtenerColorCalificacion(
                            alumno.calificacionFinal
                          )}
                          sx={{ fontWeight: "bold", minWidth: 60 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.estado.toUpperCase()}
                          color={obtenerColorEstado(alumno.estado)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Protected>
  );
}

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
  LinearProgress,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

// Íconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";

import Protected from "@/components/Protected";

// Tipos
interface ProfesorInfo {
  id: number;
  claveEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  carrera: string;
  periodo: string;
}

interface EstadisticasProfesor {
  gruposAsignados: number;
  totalAlumnos: number;
  promedioGlobal: number;
  promedioMasAlto: number;
  promedioMasBajo: number;
  tasaAprobacionPromedio: number;
  totalAprobados: number;
  totalReprobados: number;
}

interface GrupoAsignado {
  id: number;
  nombre: string;
  materia: string;
  totalAlumnos: number;
  promedioGrupo: number;
  aprobados: number;
  reprobados: number;
  tasaAprobacion: number;
}

interface DistribucionCalificaciones {
  rango: string;
  cantidad: number;
  porcentaje: number;
}

interface HistorialPeriodo {
  periodo: string;
  promedio: number;
}

export default function DetalleProfesorPage() {
  const params = useParams();
  const router = useRouter();
  const profesorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const profesorInfo: ProfesorInfo = {
    id: Number(profesorId),
    claveEmpleado: "PROF001",
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "García",
    email: "juan.perez@tecnm.mx",
    carrera: "ISC",
    periodo: "Enero - Junio 2025",
  };

  const estadisticas: EstadisticasProfesor = {
    gruposAsignados: 3,
    totalAlumnos: 85,
    promedioGlobal: 8.7,
    promedioMasAlto: 9.2,
    promedioMasBajo: 8.1,
    tasaAprobacionPromedio: 94,
    totalAprobados: 80,
    totalReprobados: 5,
  };

  const gruposAsignados: GrupoAsignado[] = [
    {
      id: 1,
      nombre: "1A",
      materia: "Programación I",
      totalAlumnos: 30,
      promedioGrupo: 8.5,
      aprobados: 28,
      reprobados: 2,
      tasaAprobacion: 93,
    },
    {
      id: 2,
      nombre: "3B",
      materia: "Estructura de Datos",
      totalAlumnos: 28,
      promedioGrupo: 9.2,
      aprobados: 27,
      reprobados: 1,
      tasaAprobacion: 96,
    },
    {
      id: 3,
      nombre: "5A",
      materia: "Bases de Datos",
      totalAlumnos: 27,
      promedioGrupo: 8.1,
      aprobados: 25,
      reprobados: 2,
      tasaAprobacion: 93,
    },
  ];

  const distribucionCalificaciones: DistribucionCalificaciones[] = [
    { rango: "10", cantidad: 8, porcentaje: 9 },
    { rango: "9-9.9", cantidad: 25, porcentaje: 29 },
    { rango: "8-8.9", cantidad: 30, porcentaje: 35 },
    { rango: "7-7.9", cantidad: 17, porcentaje: 20 },
    { rango: "6-6.9", cantidad: 3, porcentaje: 4 },
    { rango: "<6", cantidad: 2, porcentaje: 3 },
  ];

  const historialPeriodos: HistorialPeriodo[] = [
    { periodo: "2024-1", promedio: 8.3 },
    { periodo: "2024-2", promedio: 8.5 },
    { periodo: "2025-1", promedio: 8.7 },
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };
    cargarDatos();
  }, [profesorId]);

  const handleVolver = () => {
    router.push("/reportes/profesores");
  };

  const handleExportarPDF = () => {
    console.log("Exportar a PDF");
  };

  const handleExportarExcel = () => {
    console.log("Exportar a Excel");
  };

  const handleVerGrupo = (grupoId: number) => {
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

  const nombreCompleto = `${profesorInfo.nombre} ${profesorInfo.apellidoPaterno} ${profesorInfo.apellidoMaterno}`;

  // Datos para gráficos
  const nombresGruposGrafico = gruposAsignados.map(
    (g) => `${g.nombre} - ${g.materia}`
  );
  const promediosGruposGrafico = gruposAsignados.map((g) => g.promedioGrupo);

  const periodosGrafico = historialPeriodos.map((h) => h.periodo);
  const promediosHistorialGrafico = historialPeriodos.map((h) => h.promedio);

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
            Volver a Estadísticas de Profesores
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
                sx={{ mb: 2 }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "warning.main",
                    fontSize: 28,
                  }}
                >
                  {profesorInfo.nombre.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {nombreCompleto}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    sx={{ mt: 1 }}
                  >
                    <Chip
                      icon={<BadgeIcon />}
                      label={profesorInfo.claveEmpleado}
                      size="small"
                    />
                    <Chip
                      icon={<SchoolIcon />}
                      label={profesorInfo.carrera}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      icon={<EmailIcon />}
                      label={profesorInfo.email}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Stack>
              <Chip
                icon={<CalendarTodayIcon />}
                label={profesorInfo.periodo}
                variant="outlined"
              />
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
            <Card sx={{ bgcolor: "warning.main", color: "white" }}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.promedioGlobal.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" align="center">
                    Promedio Global
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <GroupsIcon sx={{ fontSize: 32, color: "info.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.gruposAsignados}
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

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <SchoolIcon sx={{ fontSize: 32, color: "info.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.totalAlumnos}
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
                    Mejor Grupo
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
                    {estadisticas.totalAprobados}
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
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {estadisticas.tasaAprobacionPromedio}%
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

        {/* Gráficos principales */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Gráfico de barras - Promedios por grupo */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Promedios por Grupo Asignado
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
                    yAxis={[{ min: 0, max: 10 }]}
                    series={[
                      {
                        data: promediosGruposGrafico,
                        label: "Promedio",
                        color: "#ed6c02",
                      },
                    ]}
                    height={300}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de pastel - Distribución */}
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
                    height: 300,
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
                    height={300}
                    width={300}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Historial de rendimiento */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Evolución del Promedio
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: "100%", height: 250 }}>
              <LineChart
                xAxis={[{ scaleType: "point", data: periodosGrafico }]}
                yAxis={[{ min: 7, max: 10 }]}
                series={[
                  {
                    data: promediosHistorialGrafico,
                    label: "Promedio por Periodo",
                    color: "#ed6c02",
                    curve: "linear",
                  },
                ]}
                height={250}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Tabla de distribución */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Análisis Detallado de Calificaciones
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rango</TableCell>
                    <TableCell align="center">Alumnos</TableCell>
                    <TableCell align="center">Porcentaje</TableCell>
                    <TableCell>Distribución</TableCell>
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
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={dist.porcentaje}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                          />
                          <Typography variant="caption">
                            {dist.porcentaje}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Tabla de grupos asignados */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Grupos Asignados en el Periodo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Grupo</TableCell>
                    <TableCell>Materia</TableCell>
                    <TableCell align="center">Alumnos</TableCell>
                    <TableCell align="center">Promedio</TableCell>
                    <TableCell align="center">Aprobados</TableCell>
                    <TableCell align="center">Reprobados</TableCell>
                    <TableCell align="center">Tasa Aprob.</TableCell>
                    <TableCell align="center">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gruposAsignados.map((grupo) => (
                    <TableRow key={grupo.id} hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {grupo.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <MenuBookIcon fontSize="small" color="action" />
                          <span>{grupo.materia}</span>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{grupo.totalAlumnos}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={grupo.promedioGrupo.toFixed(1)}
                          color={obtenerColorPromedio(grupo.promedioGrupo)}
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
                        <Tooltip title="Ver detalle del grupo">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleVerGrupo(grupo.id)}
                          >
                            <GroupsIcon />
                          </IconButton>
                        </Tooltip>
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

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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

// Íconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";

import Protected from "@/components/Protected";

// Tipos
interface AlumnoInfo {
  id: number;
  matricula: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  carrera: string;
  nombreCarrera: string;
  semestreActual: number;
  fechaIngreso: string;
}

interface EstadisticasAlumno {
  promedioGeneral: number;
  creditosAcumulados: number;
  creditosTotales: number;
  porcentajeAvance: number;
  materiasAprobadas: number;
  materiasReprobadas: number;
  materiasCursando: number;
  totalMaterias: number;
  tasaAprobacion: number;
  calificacionMasAlta: number;
  calificacionMasBaja: number;
}

interface PeriodoAcademico {
  periodo: string;
  promedioPeriodo: number;
  creditosObtenidos: number;
  materias: MateriaHistorial[];
}

interface MateriaHistorial {
  id: number;
  clave: string;
  nombre: string;
  creditos: number;
  calificacion: number;
  profesor: string;
  estado: "aprobada" | "reprobada" | "cursando";
}

export default function HistorialAlumnoPage() {
  const params = useParams();
  const router = useRouter();
  const alumnoId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const alumnoInfo: AlumnoInfo = {
    id: Number(alumnoId),
    matricula: "20240001",
    nombre: "Pedro",
    apellidoPaterno: "Sánchez",
    apellidoMaterno: "López",
    email: "pedro.sanchez@tecnm.mx",
    carrera: "ISC",
    nombreCarrera: "Ing. en Sistemas Computacionales",
    semestreActual: 5,
    fechaIngreso: "Agosto 2024",
  };

  const estadisticas: EstadisticasAlumno = {
    promedioGeneral: 9.2,
    creditosAcumulados: 180,
    creditosTotales: 250,
    porcentajeAvance: 72,
    materiasAprobadas: 25,
    materiasReprobadas: 0,
    materiasCursando: 6,
    totalMaterias: 31,
    tasaAprobacion: 100,
    calificacionMasAlta: 10.0,
    calificacionMasBaja: 8.5,
  };

  const historialPeriodos: PeriodoAcademico[] = [
    {
      periodo: "2024-1",
      promedioPeriodo: 8.8,
      creditosObtenidos: 35,
      materias: [
        {
          id: 1,
          clave: "ACA-0101",
          nombre: "Cálculo Diferencial",
          creditos: 5,
          calificacion: 8.5,
          profesor: "Dr. Juan García",
          estado: "aprobada",
        },
        {
          id: 2,
          clave: "AED-1001",
          nombre: "Fundamentos de Programación",
          creditos: 5,
          calificacion: 9.0,
          profesor: "Ing. María López",
          estado: "aprobada",
        },
        {
          id: 3,
          clave: "ACC-1001",
          nombre: "Química",
          creditos: 4,
          calificacion: 8.8,
          profesor: "M.C. Carlos Pérez",
          estado: "aprobada",
        },
      ],
    },
    {
      periodo: "2024-2",
      promedioPeriodo: 9.3,
      creditosObtenidos: 40,
      materias: [
        {
          id: 4,
          clave: "ACA-0102",
          nombre: "Cálculo Integral",
          creditos: 5,
          calificacion: 9.2,
          profesor: "Dr. Juan García",
          estado: "aprobada",
        },
        {
          id: 5,
          clave: "AED-1002",
          nombre: "Programación Orientada a Objetos",
          creditos: 5,
          calificacion: 9.5,
          profesor: "Ing. María López",
          estado: "aprobada",
        },
        {
          id: 6,
          clave: "SCD-1001",
          nombre: "Estructura de Datos",
          creditos: 5,
          calificacion: 9.0,
          profesor: "M.C. Ana Martínez",
          estado: "aprobada",
        },
      ],
    },
    {
      periodo: "2025-1 (Actual)",
      promedioPeriodo: 9.5,
      creditosObtenidos: 0,
      materias: [
        {
          id: 7,
          clave: "SCD-1002",
          nombre: "Bases de Datos",
          creditos: 5,
          calificacion: 0,
          profesor: "Dr. Roberto Sánchez",
          estado: "cursando",
        },
        {
          id: 8,
          clave: "AED-1003",
          nombre: "Desarrollo Web",
          creditos: 5,
          calificacion: 0,
          profesor: "Ing. Laura Torres",
          estado: "cursando",
        },
        {
          id: 9,
          clave: "SCC-1001",
          nombre: "Redes de Computadoras",
          creditos: 5,
          calificacion: 0,
          profesor: "M.C. Miguel Ruiz",
          estado: "cursando",
        },
      ],
    },
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
  }, [alumnoId]);

  const handleVolver = () => {
    router.push("/reportes/alumnos");
  };

  const handleExportarPDF = () => {
    console.log("Exportar a PDF");
  };

  const handleExportarExcel = () => {
    console.log("Exportar a Excel");
  };

  const obtenerColorCalificacion = (
    calificacion: number
  ): "success" | "info" | "warning" | "error" | "default" => {
    if (calificacion === 0) return "default";
    if (calificacion >= 9) return "success";
    if (calificacion >= 8) return "info";
    if (calificacion >= 7) return "warning";
    return "error";
  };

  const obtenerColorEstado = (
    estado: string
  ): "success" | "error" | "default" => {
    switch (estado) {
      case "aprobada":
        return "success";
      case "reprobada":
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

  const nombreCompleto = `${alumnoInfo.nombre} ${alumnoInfo.apellidoPaterno} ${alumnoInfo.apellidoMaterno}`;

  // Datos para gráfico de tendencia
  const periodosGrafico = historialPeriodos
    .filter((p) => p.promedioPeriodo > 0)
    .map((p) => p.periodo);
  const promediosGrafico = historialPeriodos
    .filter((p) => p.promedioPeriodo > 0)
    .map((p) => p.promedioPeriodo);

  // Datos para gráfico de materias aprobadas/reprobadas
  const todasMaterias = historialPeriodos.flatMap((p) => p.materias);
  const materiasCompletadas = todasMaterias.filter(
    (m) => m.estado === "aprobada" || m.estado === "reprobada"
  );
  const dataMateriasGrafico = [
    { label: "Aprobadas", value: estadisticas.materiasAprobadas },
    { label: "Reprobadas", value: estadisticas.materiasReprobadas },
    { label: "Cursando", value: estadisticas.materiasCursando },
  ];

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
            Volver a Alumnos
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
                    bgcolor: "secondary.main",
                    fontSize: 28,
                  }}
                >
                  {alumnoInfo.nombre.charAt(0)}
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
                      label={alumnoInfo.matricula}
                      size="small"
                    />
                    <Chip
                      icon={<SchoolIcon />}
                      label={alumnoInfo.carrera}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      icon={<EmailIcon />}
                      label={alumnoInfo.email}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label={alumnoInfo.nombreCarrera} variant="outlined" />
                <Chip
                  label={`Semestre ${alumnoInfo.semestreActual}°`}
                  color="secondary"
                />
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={alumnoInfo.fechaIngreso}
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
          <Grid item xs={6} sm={4} md={3}>
            <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
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

          <Grid item xs={6} sm={4} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <CheckCircleIcon
                    sx={{ fontSize: 32, color: "success.main" }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.materiasAprobadas}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Aprobadas
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <CancelIcon sx={{ fontSize: 32, color: "error.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.materiasReprobadas}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Reprobadas
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <AssignmentIcon sx={{ fontSize: 32, color: "info.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.materiasCursando}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Cursando
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <EmojiEventsIcon
                    sx={{ fontSize: 32, color: "warning.main" }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {estadisticas.calificacionMasAlta.toFixed(1)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Calif. Más Alta
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {estadisticas.tasaAprobacion}%
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

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Avance de Créditos
                </Typography>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {estadisticas.creditosAcumulados} /{" "}
                  {estadisticas.creditosTotales}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={estadisticas.porcentajeAvance}
                    sx={{ flexGrow: 1, height: 10, borderRadius: 1 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {estadisticas.porcentajeAvance}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Gráfico de tendencia */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Evolución del Promedio
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ width: "100%", height: 300 }}>
                  <LineChart
                    xAxis={[{ scaleType: "point", data: periodosGrafico }]}
                    yAxis={[{ min: 7, max: 10 }]}
                    series={[
                      {
                        data: promediosGrafico,
                        label: "Promedio por Periodo",
                        color: "#9c27b0",
                        curve: "linear",
                      },
                    ]}
                    height={300}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de materias */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Estatus de Materias
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ width: "100%", height: 300 }}>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: dataMateriasGrafico.map((d) => d.label),
                      },
                    ]}
                    series={[
                      {
                        data: dataMateriasGrafico.map((d) => d.value),
                        color: "#9c27b0",
                      },
                    ]}
                    height={300}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Historial por periodo */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Historial Académico por Periodo
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {historialPeriodos.map((periodo, index) => (
              <Accordion
                key={index}
                defaultExpanded={index === historialPeriodos.length - 1}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ width: "100%" }}
                    flexWrap="wrap"
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {periodo.periodo}
                    </Typography>
                    <Chip
                      label={`Promedio: ${periodo.promedioPeriodo.toFixed(1)}`}
                      color={
                        periodo.promedioPeriodo >= 9
                          ? "success"
                          : periodo.promedioPeriodo >= 8
                          ? "info"
                          : "warning"
                      }
                      size="small"
                    />
                    {periodo.creditosObtenidos > 0 && (
                      <Chip
                        label={`${periodo.creditosObtenidos} créditos`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`${periodo.materias.length} materias`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Clave</TableCell>
                          <TableCell>Materia</TableCell>
                          <TableCell>Profesor</TableCell>
                          <TableCell align="center">Créditos</TableCell>
                          <TableCell align="center">Calificación</TableCell>
                          <TableCell align="center">Estado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {periodo.materias.map((materia) => (
                          <TableRow key={materia.id} hover>
                            <TableCell>
                              <Chip
                                label={materia.clave}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <MenuBookIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {materia.nombre}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {materia.profesor}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {materia.creditos}
                            </TableCell>
                            <TableCell align="center">
                              {materia.estado === "cursando" ? (
                                <Chip
                                  label="En curso"
                                  size="small"
                                  color="default"
                                />
                              ) : (
                                <Chip
                                  label={materia.calificacion.toFixed(1)}
                                  color={obtenerColorCalificacion(
                                    materia.calificacion
                                  )}
                                  size="small"
                                  sx={{ fontWeight: "bold", minWidth: 50 }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={materia.estado.toUpperCase()}
                                color={obtenerColorEstado(materia.estado)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Protected>
  );
}

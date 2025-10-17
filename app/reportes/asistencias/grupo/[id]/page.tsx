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
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

// Íconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import Protected from "@/components/Protected";

// Tipos
interface AsistenciaDetalle {
  fecha: string;
  presente: number;
  ausente: number;
  retardo: number;
  justificado: number;
  porcentaje: number;
}

interface AlumnoAsistencia {
  id: number;
  matricula: string;
  nombre: string;
  presentes: number;
  ausentes: number;
  retardos: number;
  justificados: number;
  totalClases: number;
  porcentaje: number;
}

interface GrupoInfo {
  id: number;
  nombre: string;
  materia: string;
  profesor: string;
  periodo: string;
  totalAlumnos: number;
}

interface EstadisticasResumen {
  totalClases: number;
  promedioAsistencia: number;
  totalPresentes: number;
  totalAusentes: number;
  totalRetardos: number;
  totalJustificados: number;
}

export default function ReporteAsistenciaGrupoPage() {
  const params = useParams();
  const router = useRouter();
  const grupoId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - Reemplazar con llamadas a API
  const grupoInfo: GrupoInfo = {
    id: Number(grupoId),
    nombre: "1A",
    materia: "Programación I",
    profesor: "Juan Pérez García",
    periodo: "Enero - Junio 2025",
    totalAlumnos: 5,
  };

  const asistenciasPorFecha: AsistenciaDetalle[] = [
    {
      fecha: "2025-01-10",
      presente: 28,
      ausente: 2,
      retardo: 0,
      justificado: 0,
      porcentaje: 93,
    },
    {
      fecha: "2025-01-15",
      presente: 30,
      ausente: 0,
      retardo: 0,
      justificado: 0,
      porcentaje: 100,
    },
    {
      fecha: "2025-01-20",
      presente: 27,
      ausente: 1,
      retardo: 2,
      justificado: 0,
      porcentaje: 90,
    },
    {
      fecha: "2025-01-25",
      presente: 29,
      ausente: 0,
      retardo: 1,
      justificado: 0,
      porcentaje: 97,
    },
    {
      fecha: "2025-01-30",
      presente: 28,
      ausente: 1,
      retardo: 1,
      justificado: 0,
      porcentaje: 93,
    },
    {
      fecha: "2025-02-05",
      presente: 26,
      ausente: 2,
      retardo: 0,
      justificado: 2,
      porcentaje: 87,
    },
    {
      fecha: "2025-02-10",
      presente: 30,
      ausente: 0,
      retardo: 0,
      justificado: 0,
      porcentaje: 100,
    },
  ];

  const alumnosAsistencia: AlumnoAsistencia[] = [
    {
      id: 1,
      matricula: "20240001",
      nombre: "Pedro Sánchez López",
      presentes: 7,
      ausentes: 0,
      retardos: 0,
      justificados: 0,
      totalClases: 7,
      porcentaje: 100,
    },
    {
      id: 2,
      matricula: "20240002",
      nombre: "Laura Gómez Díaz",
      presentes: 6,
      ausentes: 1,
      retardos: 0,
      justificados: 0,
      totalClases: 7,
      porcentaje: 86,
    },
    {
      id: 3,
      matricula: "20240003",
      nombre: "José Hernández Ruiz",
      presentes: 6,
      ausentes: 0,
      retardos: 1,
      justificados: 0,
      totalClases: 7,
      porcentaje: 86,
    },
    {
      id: 4,
      matricula: "20240004",
      nombre: "Carmen Rodríguez Flores",
      presentes: 5,
      ausentes: 2,
      retardos: 0,
      justificados: 0,
      totalClases: 7,
      porcentaje: 71,
    },
    {
      id: 5,
      matricula: "20240005",
      nombre: "Miguel Ángel Torres",
      presentes: 7,
      ausentes: 0,
      retardos: 0,
      justificados: 0,
      totalClases: 7,
      porcentaje: 100,
    },
  ];

  const estadisticas: EstadisticasResumen = {
    totalClases: 7,
    promedioAsistencia: 92,
    totalPresentes: 198,
    totalAusentes: 6,
    totalRetardos: 4,
    totalJustificados: 2,
  };

  useEffect(() => {
    // Simular carga de datos
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Aquí irían las llamadas a tu API
        // const data = await reportesService.getAsistenciasPorGrupo(grupoId);
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
    router.push("/reportes/asistencias");
  };

  const handleExportarPDF = () => {
    console.log("Exportar a PDF");
    // Implementar lógica de exportación
  };

  const handleExportarExcel = () => {
    console.log("Exportar a Excel");
    // Implementar lógica de exportación
  };

  const obtenerColorAsistencia = (
    porcentaje: number
  ): "success" | "warning" | "error" => {
    if (porcentaje >= 90) return "success";
    if (porcentaje >= 80) return "warning";
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

  // Datos para el gráfico
  const fechasGrafico = asistenciasPorFecha.map((a) =>
    new Date(a.fecha).toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
    })
  );
  const porcentajesGrafico = asistenciasPorFecha.map((a) => a.porcentaje);

  return (
    <Protected>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Encabezado con botón volver */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleVolver}
            sx={{ mb: 2 }}
          >
            Volver a Asistencias
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
                <GroupsIcon sx={{ fontSize: 36, color: "primary.main" }} />
                <Typography variant="h4" fontWeight="bold">
                  Reporte de Asistencias - Grupo {grupoInfo.nombre}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={grupoInfo.periodo}
                  variant="outlined"
                />
                <Chip label={grupoInfo.materia} color="primary" />
                <Chip
                  label={`Profesor: ${grupoInfo.profesor}`}
                  variant="outlined"
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
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <CheckCircleIcon
                    sx={{ fontSize: 32, color: "success.main" }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.totalPresentes}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Presentes
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
                    {estadisticas.totalAusentes}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Ausentes
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <AccessTimeIcon
                    sx={{ fontSize: 32, color: "warning.main" }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.totalRetardos}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Retardos
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <VerifiedIcon sx={{ fontSize: 32, color: "info.main" }} />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.totalJustificados}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Justificados
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <CalendarTodayIcon
                    sx={{ fontSize: 32, color: "primary.main" }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.totalClases}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Clases
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ bgcolor: "primary.main", color: "white" }}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h5" fontWeight="bold">
                    {estadisticas.promedioAsistencia}%
                  </Typography>
                  <Typography variant="body2" align="center">
                    Promedio
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráfico de tendencia */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tendencia de Asistencias
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <LineChart
                xAxis={[{ scaleType: "point", data: fechasGrafico }]}
                series={[
                  {
                    data: porcentajesGrafico,
                    label: "% Asistencia",
                    color: "#1976d2",
                  },
                ]}
                height={300}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Tabla de asistencias por alumno */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Asistencias por Alumno
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="center">Presentes</TableCell>
                    <TableCell align="center">Ausentes</TableCell>
                    <TableCell align="center">Retardos</TableCell>
                    <TableCell align="center">Justificados</TableCell>
                    <TableCell align="center">Total Clases</TableCell>
                    <TableCell align="center">% Asistencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnosAsistencia.map((alumno) => (
                    <TableRow key={alumno.id} hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {alumno.matricula}
                        </Typography>
                      </TableCell>
                      <TableCell>{alumno.nombre}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.presentes}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.ausentes}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.retardos}
                          color="warning"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alumno.justificados}
                          color="info"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{alumno.totalClases}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${alumno.porcentaje}%`}
                          color={obtenerColorAsistencia(alumno.porcentaje)}
                          sx={{ fontWeight: "bold" }}
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

"use client";

import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Stack,
  Chip,
} from "@mui/material";

// Íconos
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

// Componente de protección de rutas (ajusta la ruta según tu proyecto)
import Protected from "@/components/Protected";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  badge?: string;
}

export default function ReportesPage() {
  const router = useRouter();

  const reportCards: ReportCard[] = [
    {
      id: "asistencias",
      title: "Asistencias",
      description:
        "Consulta reportes de asistencia por grupo o alumno individual",
      icon: <AssignmentIcon sx={{ fontSize: 48 }} />,
      path: "/reportes/asistencias",
      color: "#1976d2", // Azul
      badge: "Por grupo/alumno",
    },
    {
      id: "grupos",
      title: "Estadísticas de Grupos",
      description: "Promedios generales y métricas de rendimiento por grupo",
      icon: <GroupsIcon sx={{ fontSize: 48 }} />,
      path: "/reportes/grupos",
      color: "#2e7d32", // Verde
      badge: "Promedios",
    },
    {
      id: "profesores",
      title: "Estadísticas de Profesores",
      description: "Rendimiento académico y desempeño por docente",
      icon: <PersonIcon sx={{ fontSize: 48 }} />,
      path: "/reportes/profesores",
      color: "#ed6c02", // Naranja
      badge: "Rendimiento",
    },
    {
      id: "alumnos",
      title: "Historial Académico",
      description:
        "Consulta el historial completo de calificaciones y progreso individual",
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      path: "/reportes/alumnos",
      color: "#9c27b0", // Púrpura
      badge: "Individual",
    },
  ];

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <Protected>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Módulo de Reportes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Selecciona el tipo de reporte que deseas consultar
          </Typography>
        </Box>

        {/* Grid de tarjetas de reportes */}
        <Grid container spacing={3}>
          {reportCards.map((report) => (
            <Grid item xs={12} sm={6} md={6} key={report.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCardClick(report.path)}
                  sx={{ height: "100%", p: 2 }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      {/* Icono y badge */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            color: report.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            bgcolor: `${report.color}15`,
                          }}
                        >
                          {report.icon}
                        </Box>
                        {report.badge && (
                          <Chip
                            label={report.badge}
                            size="small"
                            sx={{
                              bgcolor: `${report.color}20`,
                              color: report.color,
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>

                      {/* Título */}
                      <Typography variant="h6" fontWeight="bold">
                        {report.title}
                      </Typography>

                      {/* Descripción */}
                      <Typography variant="body2" color="text.secondary">
                        {report.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Sección de resumen de reportes disponibles */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Tipos de Reportes Disponibles
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUpIcon color="primary" />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Asistencias
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Por grupo o alumno
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BarChartIcon color="success" />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Grupos
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Promedios generales
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimelineIcon color="warning" />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Profesores
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rendimiento docente
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <HistoryEduIcon color="secondary" />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Alumnos
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Historial académico
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Protected>
  );
}

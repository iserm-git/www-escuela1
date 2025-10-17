"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Stack,
  Chip,
  alpha,
} from "@mui/material";

// Íconos
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  badge?: string;
}

interface ReportSelectorProps {
  /**
   * Lista de reportes a mostrar
   * Si no se proporciona, usa la lista por defecto
   */
  reports?: ReportOption[];
  /**
   * Callback cuando se selecciona un reporte
   * Si no se proporciona, navega usando router
   */
  onSelect?: (reportId: string, path: string) => void;
  /**
   * Tamaño de los íconos
   * @default 48
   */
  iconSize?: number;
  /**
   * Mostrar badges en las tarjetas
   * @default true
   */
  showBadges?: boolean;
}

const defaultReports: ReportOption[] = [
  {
    id: "asistencias",
    title: "Asistencias",
    description:
      "Consulta reportes de asistencia por grupo o alumno individual",
    icon: <AssignmentIcon />,
    path: "/reportes/asistencias",
    color: "#1976d2", // Azul
    badge: "Por grupo/alumno",
  },
  {
    id: "grupos",
    title: "Estadísticas de Grupos",
    description: "Promedios generales y métricas de rendimiento por grupo",
    icon: <GroupsIcon />,
    path: "/reportes/grupos",
    color: "#2e7d32", // Verde
    badge: "Promedios",
  },
  {
    id: "profesores",
    title: "Estadísticas de Profesores",
    description: "Rendimiento académico y desempeño por docente",
    icon: <PersonIcon />,
    path: "/reportes/profesores",
    color: "#ed6c02", // Naranja
    badge: "Rendimiento",
  },
  {
    id: "alumnos",
    title: "Historial Académico",
    description:
      "Consulta el historial completo de calificaciones y progreso individual",
    icon: <SchoolIcon />,
    path: "/reportes/alumnos",
    color: "#9c27b0", // Púrpura
    badge: "Individual",
  },
];

export default function ReportSelector({
  reports = defaultReports,
  onSelect,
  iconSize = 48,
  showBadges = true,
}: ReportSelectorProps) {
  const router = useRouter();

  const handleCardClick = (report: ReportOption) => {
    if (onSelect) {
      onSelect(report.id, report.path);
    } else {
      router.push(report.path);
    }
  };

  return (
    <>
      {reports.map((report) => (
        <Card
          key={report.id}
          sx={{
            height: "100%",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: 6,
              "& .icon-container": {
                bgcolor: report.color,
                color: "white",
              },
            },
          }}
        >
          <CardActionArea
            onClick={() => handleCardClick(report)}
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
                  {/* Contenedor del ícono */}
                  <Box
                    className="icon-container"
                    sx={{
                      color: report.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      bgcolor: alpha(report.color, 0.08),
                      transition: "all 0.3s ease",
                      "& svg": {
                        fontSize: iconSize,
                      },
                    }}
                  >
                    {report.icon}
                  </Box>

                  {/* Badge */}
                  {showBadges && report.badge && (
                    <Chip
                      label={report.badge}
                      size="small"
                      sx={{
                        bgcolor: alpha(report.color, 0.12),
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
      ))}
    </>
  );
}

// Componente auxiliar para versión compacta
export function ReportSelectorCompact({
  reports = defaultReports,
  onSelect,
}: Pick<ReportSelectorProps, "reports" | "onSelect">) {
  const router = useRouter();

  const handleCardClick = (report: ReportOption) => {
    if (onSelect) {
      onSelect(report.id, report.path);
    } else {
      router.push(report.path);
    }
  };

  return (
    <>
      {reports.map((report) => (
        <Card
          key={report.id}
          sx={{
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: 3,
              transform: "scale(1.02)",
            },
          }}
        >
          <CardActionArea onClick={() => handleCardClick(report)}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                {/* Ícono pequeño */}
                <Box
                  sx={{
                    color: report.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: alpha(report.color, 0.08),
                    "& svg": {
                      fontSize: 32,
                    },
                  }}
                >
                  {report.icon}
                </Box>

                {/* Texto */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {report.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {report.badge}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  );
}

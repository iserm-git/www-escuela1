"use client";

import Protected from "@/components/Protected";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import GroupIcon from "@mui/icons-material/Group"; // Alumnos
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"; // Profesores
import ClassIcon from "@mui/icons-material/Class"; // Grupos
import MenuBookIcon from "@mui/icons-material/MenuBook"; // Materias
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

type KPI = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  data: number[];
  trend?: "up" | "down" | "flat";
};

function KpiCard({ title, value, icon, data, trend = "flat" }: KPI) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          </Stack>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "action.hover",
              display: "grid",
              placeItems: "center",
            }}
            aria-label={`${title} icon`}
          >
            {icon}
          </Box>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <SparkLineChart
            data={data}
            height={60}
            showHighlight
            color={
              trend === "up"
                ? "success.main"
                : trend === "down"
                ? "error.main"
                : "primary.main"
            }
            // NOTA: por guideline de la herramienta, no definimos colores específicos.
            xAxis={{ scaleType: "point" }}
            curve="linear"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  // Datos mock — reemplázalos con tus cifras reales del backend
  const stats = {
    alumnos: { total: 120, serie: [90, 95, 100, 105, 110, 115, 120] }, // tendencia ↑
    profesores: { total: 18, serie: [18, 17, 17, 18, 18, 18, 18] }, // estable
    grupos: { total: 8, serie: [6, 6, 7, 7, 8, 8, 8] }, // ↑
    materias: { total: 36, serie: [34, 34, 35, 35, 36, 36, 36] }, // ↑
  };

  const KPIS: KPI[] = [
    {
      title: "Alumnos",
      value: stats.alumnos.total,
      icon: <GroupIcon />,
      data: stats.alumnos.serie,
      trend: "up",
    },
    {
      title: "Profesores",
      value: stats.profesores.total,
      icon: <PersonOutlineIcon />,
      data: stats.profesores.serie,
      trend: "flat",
    },
    {
      title: "Grupos",
      value: stats.grupos.total,
      icon: <ClassIcon />,
      data: stats.grupos.serie,
      trend: "up",
    },
    {
      title: "Materias",
      value: stats.materias.total,
      icon: <MenuBookIcon />,
      data: stats.materias.serie,
      trend: "up",
    },
  ];

  return (
    <Protected>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={2}>
          {KPIS.map((kpi) => (
            <Grid item xs={12} sm={6} md={3} key={kpi.title}>
              <KpiCard {...kpi} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Protected>
  );
}

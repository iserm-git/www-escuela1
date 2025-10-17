"use client";

import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

// Íconos
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";

// Tipos
export interface AsistenciaData {
  fecha: string;
  presente: number;
  ausente: number;
  retardo: number;
  justificado: number;
  porcentaje?: number;
}

export interface AsistenciaResumen {
  totalClases: number;
  totalPresentes: number;
  totalAusentes: number;
  totalRetardos: number;
  totalJustificados: number;
  porcentajePromedio: number;
}

export type ChartType = "line" | "bar" | "pie";
export type TrendType = "up" | "down" | "flat";

interface AsistenciaChartProps {
  /**
   * Datos de asistencia por fecha
   */
  data: AsistenciaData[];
  /**
   * Tipo de gráfico a mostrar
   * @default "line"
   */
  type?: ChartType;
  /**
   * Altura del gráfico en píxeles
   * @default 300
   */
  height?: number;
  /**
   * Título del gráfico
   */
  title?: string;
  /**
   * Mostrar leyenda
   * @default true
   */
  showLegend?: boolean;
  /**
   * Mostrar resumen de estadísticas
   * @default true
   */
  showSummary?: boolean;
  /**
   * Mostrar indicador de tendencia
   * @default true
   */
  showTrend?: boolean;
  /**
   * Mostrar solo porcentajes (no valores absolutos)
   * @default false
   */
  percentageOnly?: boolean;
  /**
   * Colores personalizados
   */
  colors?: {
    presente?: string;
    ausente?: string;
    retardo?: string;
    justificado?: string;
  };
}

export default function AsistenciaChart({
  data,
  type = "line",
  height = 300,
  title,
  showLegend = true,
  showSummary = true,
  showTrend = true,
  percentageOnly = false,
  colors,
}: AsistenciaChartProps) {
  const theme = useTheme();

  // Colores por defecto
  const defaultColors = {
    presente: colors?.presente || theme.palette.success.main,
    ausente: colors?.ausente || theme.palette.error.main,
    retardo: colors?.retardo || theme.palette.warning.main,
    justificado: colors?.justificado || theme.palette.info.main,
  };

  // Calcular resumen
  const resumen: AsistenciaResumen = useMemo(() => {
    const totalClases = data.length;
    const totalPresentes = data.reduce((sum, d) => sum + d.presente, 0);
    const totalAusentes = data.reduce((sum, d) => sum + d.ausente, 0);
    const totalRetardos = data.reduce((sum, d) => sum + d.retardo, 0);
    const totalJustificados = data.reduce((sum, d) => sum + d.justificado, 0);

    const totalRegistros =
      totalPresentes + totalAusentes + totalRetardos + totalJustificados;
    const porcentajePromedio =
      totalRegistros > 0
        ? Math.round((totalPresentes / totalRegistros) * 100)
        : 0;

    return {
      totalClases,
      totalPresentes,
      totalAusentes,
      totalRetardos,
      totalJustificados,
      porcentajePromedio,
    };
  }, [data]);

  // Calcular tendencia
  const tendencia: TrendType = useMemo(() => {
    if (data.length < 2) return "flat";

    const mitad = Math.floor(data.length / 2);
    const primerasMitad = data.slice(0, mitad);
    const segundaMitad = data.slice(mitad);

    const promedioPrimera =
      primerasMitad.reduce((sum, d) => sum + (d.porcentaje || 0), 0) /
      primerasMitad.length;
    const promedioSegunda =
      segundaMitad.reduce((sum, d) => sum + (d.porcentaje || 0), 0) /
      segundaMitad.length;

    const diferencia = promedioSegunda - promedioPrimera;

    if (diferencia > 5) return "up";
    if (diferencia < -5) return "down";
    return "flat";
  }, [data]);

  // Preparar datos para los gráficos
  const fechasFormateadas = data.map((d) => {
    const date = new Date(d.fecha);
    return date.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
  });

  const porcentajes = data.map((d) => d.porcentaje || 0);

  // Íconos de tendencia
  const obtenerIconoTendencia = () => {
    switch (tendencia) {
      case "up":
        return <TrendingUpIcon color="success" />;
      case "down":
        return <TrendingDownIcon color="error" />;
      case "flat":
        return <RemoveIcon color="action" />;
    }
  };

  const obtenerTextoTendencia = () => {
    switch (tendencia) {
      case "up":
        return "Mejorando";
      case "down":
        return "Disminuyendo";
      case "flat":
        return "Estable";
    }
  };

  // Renderizar gráfico según tipo
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            xAxis={[{ scaleType: "point", data: fechasFormateadas }]}
            yAxis={[{ min: 0, max: 100 }]}
            series={[
              {
                data: porcentajes,
                label: "% Asistencia",
                color: defaultColors.presente,
                curve: "linear",
              },
            ]}
            height={height}
            slotProps={{
              legend: { hidden: !showLegend },
            }}
          />
        );

      case "bar":
        return (
          <BarChart
            xAxis={[{ scaleType: "band", data: fechasFormateadas }]}
            series={
              percentageOnly
                ? [
                    {
                      data: porcentajes,
                      label: "% Asistencia",
                      color: defaultColors.presente,
                    },
                  ]
                : [
                    {
                      data: data.map((d) => d.presente),
                      label: "Presentes",
                      color: defaultColors.presente,
                      stack: "total",
                    },
                    {
                      data: data.map((d) => d.ausente),
                      label: "Ausentes",
                      color: defaultColors.ausente,
                      stack: "total",
                    },
                    {
                      data: data.map((d) => d.retardo),
                      label: "Retardos",
                      color: defaultColors.retardo,
                      stack: "total",
                    },
                    {
                      data: data.map((d) => d.justificado),
                      label: "Justificados",
                      color: defaultColors.justificado,
                      stack: "total",
                    },
                  ]
            }
            height={height}
            slotProps={{
              legend: { hidden: !showLegend },
            }}
          />
        );

      case "pie":
        return (
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: resumen.totalPresentes,
                    label: `Presentes (${resumen.totalPresentes})`,
                    color: defaultColors.presente,
                  },
                  {
                    id: 1,
                    value: resumen.totalAusentes,
                    label: `Ausentes (${resumen.totalAusentes})`,
                    color: defaultColors.ausente,
                  },
                  {
                    id: 2,
                    value: resumen.totalRetardos,
                    label: `Retardos (${resumen.totalRetardos})`,
                    color: defaultColors.retardo,
                  },
                  {
                    id: 3,
                    value: resumen.totalJustificados,
                    label: `Justificados (${resumen.totalJustificados})`,
                    color: defaultColors.justificado,
                  },
                ].filter((item) => item.value > 0), // Solo mostrar valores > 0
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            height={height}
            slotProps={{
              legend: { hidden: !showLegend },
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Header con título y tendencia */}
        {(title || showTrend) && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            {title && (
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
            )}
            {showTrend && data.length >= 2 && (
              <Stack direction="row" spacing={1} alignItems="center">
                {obtenerIconoTendencia()}
                <Typography variant="body2" color="text.secondary">
                  {obtenerTextoTendencia()}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        {/* Resumen de estadísticas */}
        {showSummary && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            <Chip
              label={`${resumen.porcentajePromedio}% Promedio`}
              color="primary"
              sx={{ fontWeight: "bold" }}
            />
            <Chip
              label={`✓ ${resumen.totalPresentes}`}
              size="small"
              sx={{
                bgcolor: `${defaultColors.presente}15`,
                color: defaultColors.presente,
              }}
            />
            <Chip
              label={`✗ ${resumen.totalAusentes}`}
              size="small"
              sx={{
                bgcolor: `${defaultColors.ausente}15`,
                color: defaultColors.ausente,
              }}
            />
            <Chip
              label={`⏰ ${resumen.totalRetardos}`}
              size="small"
              sx={{
                bgcolor: `${defaultColors.retardo}15`,
                color: defaultColors.retardo,
              }}
            />
            <Chip
              label={`✔ ${resumen.totalJustificados}`}
              size="small"
              sx={{
                bgcolor: `${defaultColors.justificado}15`,
                color: defaultColors.justificado,
              }}
            />
          </Stack>
        )}

        {/* Gráfico */}
        <Box sx={{ width: "100%", height }}>
          {data.length > 0 ? (
            renderChart()
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                No hay datos para mostrar
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente auxiliar solo para mostrar resumen sin gráfico
export function AsistenciaResumenCard({
  data,
  title = "Resumen de Asistencias",
}: Pick<AsistenciaChartProps, "data" | "title">) {
  const theme = useTheme();

  const resumen: AsistenciaResumen = useMemo(() => {
    const totalClases = data.length;
    const totalPresentes = data.reduce((sum, d) => sum + d.presente, 0);
    const totalAusentes = data.reduce((sum, d) => sum + d.ausente, 0);
    const totalRetardos = data.reduce((sum, d) => sum + d.retardo, 0);
    const totalJustificados = data.reduce((sum, d) => sum + d.justificado, 0);

    const totalRegistros =
      totalPresentes + totalAusentes + totalRetardos + totalJustificados;
    const porcentajePromedio =
      totalRegistros > 0
        ? Math.round((totalPresentes / totalRegistros) * 100)
        : 0;

    return {
      totalClases,
      totalPresentes,
      totalAusentes,
      totalRetardos,
      totalJustificados,
      porcentajePromedio,
    };
  }, [data]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              {resumen.porcentajePromedio}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Promedio de Asistencia
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={`Presentes: ${resumen.totalPresentes}`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`Ausentes: ${resumen.totalAusentes}`}
              color="error"
              variant="outlined"
            />
            <Chip
              label={`Retardos: ${resumen.totalRetardos}`}
              color="warning"
              variant="outlined"
            />
            <Chip
              label={`Justificados: ${resumen.totalJustificados}`}
              color="info"
              variant="outlined"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

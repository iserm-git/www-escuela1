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
  Divider,
  LinearProgress,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

// Íconos
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Tipos
export interface RendimientoData {
  id: string | number;
  nombre: string;
  aprobados: number;
  reprobados: number;
  totalAlumnos: number;
  tasaAprobacion: number;
  promedio?: number;
}

export interface RendimientoResumen {
  totalAprobados: number;
  totalReprobados: number;
  totalAlumnos: number;
  tasaAprobacionPromedio: number;
  promedioGeneral: number;
  mejorTasa: number;
  peorTasa: number;
}

export type ChartType = "bar" | "line" | "pie" | "stacked";
export type MetricType = "tasa" | "cantidad" | "ambos";

interface RendimientoChartProps {
  /**
   * Datos de rendimiento
   */
  data: RendimientoData[];
  /**
   * Tipo de gráfico
   * @default "bar"
   */
  type?: ChartType;
  /**
   * Métrica a mostrar
   * @default "tasa"
   */
  metric?: MetricType;
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
   * Mostrar resumen estadístico
   * @default true
   */
  showSummary?: boolean;
  /**
   * Mostrar línea de meta (tasa de aprobación objetivo)
   */
  targetRate?: number;
  /**
   * Mostrar top N elementos
   */
  topN?: number;
  /**
   * Ordenar datos
   * @default "desc"
   */
  sortOrder?: "asc" | "desc" | "none";
  /**
   * Mostrar indicador de tendencia
   * @default true
   */
  showTrend?: boolean;
  /**
   * Colores personalizados
   */
  colors?: {
    aprobados?: string;
    reprobados?: string;
  };
}

export default function RendimientoChart({
  data,
  type = "bar",
  metric = "tasa",
  height = 300,
  title,
  showLegend = true,
  showSummary = true,
  targetRate,
  topN,
  sortOrder = "desc",
  showTrend = true,
  colors,
}: RendimientoChartProps) {
  const theme = useTheme();

  // Colores por defecto
  const defaultColors = {
    aprobados: colors?.aprobados || theme.palette.success.main,
    reprobados: colors?.reprobados || theme.palette.error.main,
  };

  // Procesar datos
  const dataProcesada = useMemo(() => {
    let resultado = [...data];

    // Ordenar si se especifica
    if (sortOrder !== "none") {
      resultado.sort((a, b) =>
        sortOrder === "desc"
          ? b.tasaAprobacion - a.tasaAprobacion
          : a.tasaAprobacion - b.tasaAprobacion
      );
    }

    // Tomar solo top N si se especifica
    if (topN && topN > 0) {
      resultado = resultado.slice(0, topN);
    }

    return resultado;
  }, [data, sortOrder, topN]);

  // Calcular resumen
  const resumen: RendimientoResumen = useMemo(() => {
    if (data.length === 0) {
      return {
        totalAprobados: 0,
        totalReprobados: 0,
        totalAlumnos: 0,
        tasaAprobacionPromedio: 0,
        promedioGeneral: 0,
        mejorTasa: 0,
        peorTasa: 0,
      };
    }

    const totalAprobados = data.reduce((sum, d) => sum + d.aprobados, 0);
    const totalReprobados = data.reduce((sum, d) => sum + d.reprobados, 0);
    const totalAlumnos = data.reduce((sum, d) => sum + d.totalAlumnos, 0);

    const tasaAprobacionPromedio =
      totalAlumnos > 0 ? Math.round((totalAprobados / totalAlumnos) * 100) : 0;

    const promedioGeneral = data
      .filter((d) => d.promedio !== undefined)
      .reduce((sum, d, _, arr) => sum + (d.promedio || 0) / arr.length, 0);

    const tasas = data.map((d) => d.tasaAprobacion);
    const mejorTasa = Math.max(...tasas);
    const peorTasa = Math.min(...tasas);

    return {
      totalAprobados,
      totalReprobados,
      totalAlumnos,
      tasaAprobacionPromedio,
      promedioGeneral: Number(promedioGeneral.toFixed(2)),
      mejorTasa,
      peorTasa,
    };
  }, [data]);

  // Calcular tendencia
  const tendencia = useMemo((): "up" | "down" | "flat" => {
    if (data.length < 2) return "flat";

    const mitad = Math.floor(data.length / 2);
    const promedioPrimera =
      data.slice(0, mitad).reduce((sum, d) => sum + d.tasaAprobacion, 0) /
      mitad;
    const promedioSegunda =
      data.slice(mitad).reduce((sum, d) => sum + d.tasaAprobacion, 0) /
      (data.length - mitad);

    const diferencia = promedioSegunda - promedioPrimera;

    if (diferencia > 5) return "up";
    if (diferencia < -5) return "down";
    return "flat";
  }, [data]);

  // Obtener color por tasa de aprobación
  const getColorByRate = (tasa: number): string => {
    if (tasa >= 90) return theme.palette.success.main;
    if (tasa >= 80) return theme.palette.info.main;
    if (tasa >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Preparar datos para gráficos
  const nombres = dataProcesada.map((d) => d.nombre);
  const tasasAprobacion = dataProcesada.map((d) => d.tasaAprobacion);
  const aprobados = dataProcesada.map((d) => d.aprobados);
  const reprobados = dataProcesada.map((d) => d.reprobados);

  // Renderizar gráfico según tipo
  const renderChart = () => {
    switch (type) {
      case "bar":
        if (metric === "cantidad" || metric === "ambos") {
          return (
            <BarChart
              xAxis={[{ scaleType: "band", data: nombres }]}
              series={[
                {
                  data: aprobados,
                  label: "Aprobados",
                  color: defaultColors.aprobados,
                },
                {
                  data: reprobados,
                  label: "Reprobados",
                  color: defaultColors.reprobados,
                },
              ]}
              height={height}
              slotProps={{
                legend: { hidden: !showLegend },
              }}
            />
          );
        } else {
          return (
            <BarChart
              xAxis={[{ scaleType: "band", data: nombres }]}
              yAxis={[{ min: 0, max: 100 }]}
              series={[
                {
                  data: tasasAprobacion,
                  label: "Tasa de Aprobación (%)",
                  color: defaultColors.aprobados,
                },
              ]}
              height={height}
              slotProps={{
                legend: { hidden: !showLegend },
              }}
            />
          );
        }

      case "stacked":
        return (
          <BarChart
            xAxis={[{ scaleType: "band", data: nombres }]}
            series={[
              {
                data: aprobados,
                label: "Aprobados",
                color: defaultColors.aprobados,
                stack: "total",
              },
              {
                data: reprobados,
                label: "Reprobados",
                color: defaultColors.reprobados,
                stack: "total",
              },
            ]}
            height={height}
            slotProps={{
              legend: { hidden: !showLegend },
            }}
          />
        );

      case "line":
        return (
          <LineChart
            xAxis={[{ scaleType: "point", data: nombres }]}
            yAxis={[{ min: 0, max: 100 }]}
            series={[
              {
                data: tasasAprobacion,
                label: "Tasa de Aprobación",
                color: defaultColors.aprobados,
                curve: "linear",
              },
              ...(targetRate
                ? [
                    {
                      data: Array(tasasAprobacion.length).fill(targetRate),
                      label: `Meta (${targetRate}%)`,
                      color: theme.palette.grey[500],
                      curve: "linear" as const,
                    },
                  ]
                : []),
            ]}
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
                    value: resumen.totalAprobados,
                    label: `Aprobados (${resumen.totalAprobados})`,
                    color: defaultColors.aprobados,
                  },
                  {
                    id: 1,
                    value: resumen.totalReprobados,
                    label: `Reprobados (${resumen.totalReprobados})`,
                    color: defaultColors.reprobados,
                  },
                ].filter((item) => item.value > 0),
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
        {/* Header */}
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
                {tendencia === "up" && <TrendingUpIcon color="success" />}
                {tendencia === "down" && <TrendingDownIcon color="error" />}
                {tendencia === "flat" && <RemoveIcon color="action" />}
                <Typography variant="body2" color="text.secondary">
                  {tendencia === "up" && "Mejorando"}
                  {tendencia === "down" && "Disminuyendo"}
                  {tendencia === "flat" && "Estable"}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        {/* Resumen */}
        {showSummary && (
          <>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Chip
                label={`${resumen.tasaAprobacionPromedio}% Aprobación`}
                color="primary"
                sx={{ fontWeight: "bold" }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label={`${resumen.totalAprobados} Aprobados`}
                size="small"
                sx={{
                  bgcolor: `${defaultColors.aprobados}15`,
                  color: defaultColors.aprobados,
                }}
              />
              <Chip
                icon={<CancelIcon />}
                label={`${resumen.totalReprobados} Reprobados`}
                size="small"
                sx={{
                  bgcolor: `${defaultColors.reprobados}15`,
                  color: defaultColors.reprobados,
                }}
              />
            </Stack>

            {targetRate && (
              <Box sx={{ mb: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.5 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Progreso hacia meta ({targetRate}%)
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {resumen.tasaAprobacionPromedio}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(
                    (resumen.tasaAprobacionPromedio / targetRate) * 100,
                    100
                  )}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                      bgcolor:
                        resumen.tasaAprobacionPromedio >= targetRate
                          ? theme.palette.success.main
                          : resumen.tasaAprobacionPromedio >= targetRate * 0.8
                          ? theme.palette.info.main
                          : theme.palette.warning.main,
                    },
                  }}
                />
              </Box>
            )}
          </>
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

// Componente auxiliar - Tarjeta de rendimiento individual
export function RendimientoCard({
  data,
  title = "Rendimiento",
  showProgressBar = true,
}: {
  data: RendimientoData;
  title?: string;
  showProgressBar?: boolean;
}) {
  const theme = useTheme();

  const getColorByRate = (
    tasa: number
  ): "success" | "info" | "warning" | "error" => {
    if (tasa >= 90) return "success";
    if (tasa >= 80) return "info";
    if (tasa >= 70) return "warning";
    return "error";
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        <Stack spacing={2}>
          {/* Tasa principal */}
          <Box>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              {data.tasaAprobacion}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tasa de Aprobación
            </Typography>
          </Box>

          <Divider />

          {/* Desglose */}
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2">Aprobados</Typography>
              </Stack>
              <Typography variant="body1" fontWeight="bold">
                {data.aprobados}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CancelIcon color="error" fontSize="small" />
                <Typography variant="body2">Reprobados</Typography>
              </Stack>
              <Typography variant="body1" fontWeight="bold">
                {data.reprobados}
              </Typography>
            </Stack>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {data.totalAlumnos}
              </Typography>
            </Stack>
          </Stack>

          {/* Barra de progreso */}
          {showProgressBar && (
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Rendimiento
                </Typography>
                <Chip
                  label={getColorByRate(data.tasaAprobacion).toUpperCase()}
                  color={getColorByRate(data.tasaAprobacion)}
                  size="small"
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={data.tasaAprobacion}
                color={getColorByRate(data.tasaAprobacion)}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

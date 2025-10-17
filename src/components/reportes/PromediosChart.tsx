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
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

// Íconos
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// Tipos
export interface PromedioData {
  id: string | number;
  nombre: string;
  promedio: number;
  categoria?: string; // grupo, profesor, periodo, etc.
}

export interface PromedioResumen {
  promedioGeneral: number;
  promedioMasAlto: number;
  promedioMasBajo: number;
  totalElementos: number;
  porExcelencia: number; // ≥9.0
  porBueno: number; // 8.0-8.9
  porRegular: number; // 7.0-7.9
  porBajo: number; // <7.0
}

export type ChartType = "bar" | "line" | "pie";
export type Orientation = "horizontal" | "vertical";

interface PromediosChartProps {
  /**
   * Datos de promedios
   */
  data: PromedioData[];
  /**
   * Tipo de gráfico
   * @default "bar"
   */
  type?: ChartType;
  /**
   * Orientación del gráfico de barras
   * @default "vertical"
   */
  orientation?: Orientation;
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
   * Mostrar línea de promedio general
   * @default true
   */
  showAverageLine?: boolean;
  /**
   * Mostrar top N elementos
   * Si no se especifica, muestra todos
   */
  topN?: number;
  /**
   * Ordenar datos
   * @default "desc"
   */
  sortOrder?: "asc" | "desc" | "none";
  /**
   * Color del gráfico
   * Si no se especifica, usa colores por rango de promedio
   */
  color?: string;
  /**
   * Usar colores por rango de calificación
   * @default true
   */
  colorByRange?: boolean;
  /**
   * Mostrar valores en las barras
   * @default true
   */
  showValues?: boolean;
}

export default function PromediosChart({
  data,
  type = "bar",
  orientation = "vertical",
  height = 300,
  title,
  showLegend = true,
  showSummary = true,
  showAverageLine = true,
  topN,
  sortOrder = "desc",
  color,
  colorByRange = true,
  showValues = true,
}: PromediosChartProps) {
  const theme = useTheme();

  // Procesar datos
  const dataProcesada = useMemo(() => {
    let resultado = [...data];

    // Ordenar si se especifica
    if (sortOrder !== "none") {
      resultado.sort((a, b) =>
        sortOrder === "desc" ? b.promedio - a.promedio : a.promedio - b.promedio
      );
    }

    // Tomar solo top N si se especifica
    if (topN && topN > 0) {
      resultado = resultado.slice(0, topN);
    }

    return resultado;
  }, [data, sortOrder, topN]);

  // Calcular resumen
  const resumen: PromedioResumen = useMemo(() => {
    if (data.length === 0) {
      return {
        promedioGeneral: 0,
        promedioMasAlto: 0,
        promedioMasBajo: 0,
        totalElementos: 0,
        porExcelencia: 0,
        porBueno: 0,
        porRegular: 0,
        porBajo: 0,
      };
    }

    const promedios = data.map((d) => d.promedio);
    const promedioGeneral =
      promedios.reduce((sum, p) => sum + p, 0) / promedios.length;
    const promedioMasAlto = Math.max(...promedios);
    const promedioMasBajo = Math.min(...promedios);

    const porExcelencia = data.filter((d) => d.promedio >= 9).length;
    const porBueno = data.filter(
      (d) => d.promedio >= 8 && d.promedio < 9
    ).length;
    const porRegular = data.filter(
      (d) => d.promedio >= 7 && d.promedio < 8
    ).length;
    const porBajo = data.filter((d) => d.promedio < 7).length;

    return {
      promedioGeneral: Number(promedioGeneral.toFixed(2)),
      promedioMasAlto,
      promedioMasBajo,
      totalElementos: data.length,
      porExcelencia,
      porBueno,
      porRegular,
      porBajo,
    };
  }, [data]);

  // Obtener color por rango de promedio
  const getColorByRange = (promedio: number): string => {
    if (promedio >= 9) return theme.palette.success.main;
    if (promedio >= 8) return theme.palette.info.main;
    if (promedio >= 7) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Preparar datos para gráficos
  const nombres = dataProcesada.map((d) => d.nombre);
  const promedios = dataProcesada.map((d) => d.promedio);

  // Colores por rango
  const coloresPorRango = colorByRange
    ? dataProcesada.map((d) => getColorByRange(d.promedio))
    : undefined;

  // Calcular tendencia (si es una serie temporal)
  const calcularTendencia = (): "up" | "down" | "flat" => {
    if (data.length < 2) return "flat";

    const mitad = Math.floor(data.length / 2);
    const promedioPrimera =
      data.slice(0, mitad).reduce((sum, d) => sum + d.promedio, 0) / mitad;
    const promedioSegunda =
      data.slice(mitad).reduce((sum, d) => sum + d.promedio, 0) /
      (data.length - mitad);

    const diferencia = promedioSegunda - promedioPrimera;

    if (diferencia > 0.3) return "up";
    if (diferencia < -0.3) return "down";
    return "flat";
  };

  const tendencia = calcularTendencia();

  // Renderizar gráfico según tipo
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart
            xAxis={[
              orientation === "vertical"
                ? { scaleType: "band", data: nombres }
                : { min: 0, max: 10 },
            ]}
            yAxis={[
              orientation === "vertical"
                ? { min: 0, max: 10 }
                : { scaleType: "band", data: nombres },
            ]}
            series={[
              {
                data: promedios,
                label: "Promedio",
                color: color || theme.palette.primary.main,
                ...(colorByRange && { color: coloresPorRango }),
              },
            ]}
            layout={orientation === "horizontal" ? "horizontal" : "vertical"}
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
            yAxis={[{ min: 0, max: 10 }]}
            series={[
              {
                data: promedios,
                label: "Promedio",
                color: color || theme.palette.primary.main,
                curve: "linear",
              },
              ...(showAverageLine
                ? [
                    {
                      data: Array(promedios.length).fill(
                        resumen.promedioGeneral
                      ),
                      label: "Promedio General",
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
                    value: resumen.porExcelencia,
                    label: `Excelencia ≥9.0 (${resumen.porExcelencia})`,
                    color: theme.palette.success.main,
                  },
                  {
                    id: 1,
                    value: resumen.porBueno,
                    label: `Bueno 8.0-8.9 (${resumen.porBueno})`,
                    color: theme.palette.info.main,
                  },
                  {
                    id: 2,
                    value: resumen.porRegular,
                    label: `Regular 7.0-7.9 (${resumen.porRegular})`,
                    color: theme.palette.warning.main,
                  },
                  {
                    id: 3,
                    value: resumen.porBajo,
                    label: `Bajo <7.0 (${resumen.porBajo})`,
                    color: theme.palette.error.main,
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
        {title && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            {type === "line" && (
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
                label={`Promedio: ${resumen.promedioGeneral.toFixed(2)}`}
                color="primary"
                sx={{ fontWeight: "bold" }}
              />
              <Chip
                icon={<EmojiEventsIcon />}
                label={`Mayor: ${resumen.promedioMasAlto.toFixed(1)}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Menor: ${resumen.promedioMasBajo.toFixed(1)}`}
                size="small"
                variant="outlined"
              />
            </Stack>

            {type === "pie" && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  <Chip
                    label={`Excelencia: ${resumen.porExcelencia}`}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.success.main}15`,
                      color: theme.palette.success.main,
                    }}
                  />
                  <Chip
                    label={`Bueno: ${resumen.porBueno}`}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.info.main}15`,
                      color: theme.palette.info.main,
                    }}
                  />
                  <Chip
                    label={`Regular: ${resumen.porRegular}`}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.warning.main}15`,
                      color: theme.palette.warning.main,
                    }}
                  />
                  <Chip
                    label={`Bajo: ${resumen.porBajo}`}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.error.main}15`,
                      color: theme.palette.error.main,
                    }}
                  />
                </Stack>
              </>
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

// Componente auxiliar - Comparativa de promedios
export function PromediosComparativaCard({
  data,
  title = "Comparativa de Promedios",
  promedioInstitucional,
}: {
  data: PromedioData[];
  title?: string;
  promedioInstitucional?: number;
}) {
  const theme = useTheme();

  const resumen = useMemo(() => {
    if (data.length === 0) return { promedioGeneral: 0, diferencia: 0 };

    const promedioGeneral =
      data.reduce((sum, d) => sum + d.promedio, 0) / data.length;
    const diferencia = promedioInstitucional
      ? promedioGeneral - promedioInstitucional
      : 0;

    return {
      promedioGeneral: Number(promedioGeneral.toFixed(2)),
      diferencia: Number(diferencia.toFixed(2)),
    };
  }, [data, promedioInstitucional]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Promedio
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              {resumen.promedioGeneral.toFixed(2)}
            </Typography>
          </Box>

          {promedioInstitucional && (
            <>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  vs Promedio Institucional ({promedioInstitucional.toFixed(2)})
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {resumen.diferencia > 0 ? (
                    <TrendingUpIcon color="success" sx={{ fontSize: 32 }} />
                  ) : resumen.diferencia < 0 ? (
                    <TrendingDownIcon color="error" sx={{ fontSize: 32 }} />
                  ) : (
                    <RemoveIcon color="action" sx={{ fontSize: 32 }} />
                  )}
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={
                      resumen.diferencia > 0
                        ? "success.main"
                        : resumen.diferencia < 0
                        ? "error.main"
                        : "text.secondary"
                    }
                  >
                    {resumen.diferencia > 0 ? "+" : ""}
                    {resumen.diferencia.toFixed(2)}
                  </Typography>
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

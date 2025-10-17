"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";

// Íconos
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

// Tipos
export interface MateriaHistorial {
  id: number;
  clave: string;
  nombre: string;
  creditos: number;
  calificacion: number;
  profesor: string;
  estado: "aprobada" | "reprobada" | "cursando";
}

export interface PeriodoAcademico {
  periodo: string;
  promedioPeriodo: number;
  creditosObtenidos: number;
  materias: MateriaHistorial[];
}

export interface ResumenHistorial {
  promedioGeneral: number;
  creditosAcumulados: number;
  creditosTotales: number;
  materiasAprobadas: number;
  materiasReprobadas: number;
  materiasCursando: number;
  porcentajeAvance: number;
}

interface HistorialAcademicoProps {
  /**
   * Historial por periodos
   */
  historial: PeriodoAcademico[];
  /**
   * Créditos totales del plan de estudios
   */
  creditosTotales: number;
  /**
   * Título del componente
   */
  title?: string;
  /**
   * Mostrar resumen estadístico
   * @default true
   */
  showSummary?: boolean;
  /**
   * Mostrar filtros
   * @default true
   */
  showFilters?: boolean;
  /**
   * Expandir todos los periodos por defecto
   * @default false
   */
  expandAllByDefault?: boolean;
  /**
   * Periodo inicial expandido (índice)
   * Por defecto expande el último periodo
   */
  defaultExpandedIndex?: number;
  /**
   * Mostrar solo materias aprobadas/reprobadas
   */
  filterEstado?: "todos" | "aprobadas" | "reprobadas" | "cursando";
  /**
   * Callback cuando se hace clic en una materia
   */
  onMateriaClick?: (materia: MateriaHistorial) => void;
}

export default function HistorialAcademico({
  historial,
  creditosTotales,
  title = "Historial Académico por Periodo",
  showSummary = true,
  showFilters = true,
  expandAllByDefault = false,
  defaultExpandedIndex,
  filterEstado: filterEsadoInicial = "todos",
  onMateriaClick,
}: HistorialAcademicoProps) {
  const [filterEstado, setFilterEstado] = useState<string>(filterEsadoInicial);
  const [filterBusqueda, setFilterBusqueda] = useState("");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Calcular resumen
  const resumen: ResumenHistorial = useMemo(() => {
    const todasMaterias = historial.flatMap((p) => p.materias);
    const materiasAprobadas = todasMaterias.filter(
      (m) => m.estado === "aprobada"
    ).length;
    const materiasReprobadas = todasMaterias.filter(
      (m) => m.estado === "reprobada"
    ).length;
    const materiasCursando = todasMaterias.filter(
      (m) => m.estado === "cursando"
    ).length;

    const creditosAcumulados = historial.reduce(
      (sum, p) => sum + p.creditosObtenidos,
      0
    );
    const porcentajeAvance = Math.round(
      (creditosAcumulados / creditosTotales) * 100
    );

    const calificaciones = todasMaterias
      .filter((m) => m.estado !== "cursando" && m.calificacion > 0)
      .map((m) => m.calificacion);

    const promedioGeneral =
      calificaciones.length > 0
        ? calificaciones.reduce((sum, c) => sum + c, 0) / calificaciones.length
        : 0;

    return {
      promedioGeneral: Number(promedioGeneral.toFixed(2)),
      creditosAcumulados,
      creditosTotales,
      materiasAprobadas,
      materiasReprobadas,
      materiasCursando,
      porcentajeAvance,
    };
  }, [historial, creditosTotales]);

  // Filtrar historial
  const historialFiltrado = useMemo(() => {
    return historial
      .map((periodo) => ({
        ...periodo,
        materias: periodo.materias.filter((materia) => {
          const cumpleBusqueda =
            !filterBusqueda ||
            materia.nombre
              .toLowerCase()
              .includes(filterBusqueda.toLowerCase()) ||
            materia.clave
              .toLowerCase()
              .includes(filterBusqueda.toLowerCase()) ||
            materia.profesor
              .toLowerCase()
              .includes(filterBusqueda.toLowerCase());

          const cumpleEstado =
            filterEstado === "todos" || materia.estado === filterEstado;

          return cumpleBusqueda && cumpleEstado;
        }),
      }))
      .filter((periodo) => periodo.materias.length > 0); // Solo mostrar periodos con materias
  }, [historial, filterBusqueda, filterEstado]);

  // Obtener color por calificación
  const obtenerColorCalificacion = (
    calificacion: number
  ): "success" | "info" | "warning" | "error" | "default" => {
    if (calificacion === 0) return "default";
    if (calificacion >= 9) return "success";
    if (calificacion >= 8) return "info";
    if (calificacion >= 7) return "warning";
    return "error";
  };

  // Obtener color por estado
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

  // Obtener ícono por estado
  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return <CheckCircleIcon fontSize="small" color="success" />;
      case "reprobada":
        return <CancelIcon fontSize="small" color="error" />;
      case "cursando":
        return <HourglassEmptyIcon fontSize="small" color="action" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {showFilters && (
            <IconButton
              size="small"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            >
              {showFiltersPanel ? <ExpandLessIcon /> : <FilterListIcon />}
            </IconButton>
          )}
        </Stack>

        {/* Resumen */}
        {showSummary && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Promedio General
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {resumen.promedioGeneral.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Créditos
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {resumen.creditosAcumulados} / {resumen.creditosTotales}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({resumen.porcentajeAvance}% avance)
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Materias Aprobadas
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {resumen.materiasAprobadas}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Materias Reprobadas
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  {resumen.materiasReprobadas}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Filtros */}
        {showFilters && (
          <Collapse in={showFiltersPanel}>
            <Box
              sx={{
                mb: 3,
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Filtros
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Estado"
                      value={filterEstado}
                      onChange={(e) => setFilterEstado(e.target.value)}
                    >
                      <MenuItem value="todos">Todas las materias</MenuItem>
                      <MenuItem value="aprobada">Solo aprobadas</MenuItem>
                      <MenuItem value="reprobada">Solo reprobadas</MenuItem>
                      <MenuItem value="cursando">Solo cursando</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Buscar"
                      placeholder="Materia, clave o profesor..."
                      value={filterBusqueda}
                      onChange={(e) => setFilterBusqueda(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Collapse>
        )}

        {/* Historial por periodos */}
        {historialFiltrado.length > 0 ? (
          historialFiltrado.map((periodo, index) => {
            const defaultExpanded =
              expandAllByDefault ||
              (defaultExpandedIndex !== undefined
                ? index === defaultExpandedIndex
                : index === historialFiltrado.length - 1);

            return (
              <Accordion
                key={periodo.periodo}
                defaultExpanded={defaultExpanded}
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
                          : periodo.promedioPeriodo >= 7
                          ? "warning"
                          : "error"
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
                          <TableRow
                            key={materia.id}
                            hover
                            onClick={() =>
                              onMateriaClick && onMateriaClick(materia)
                            }
                            sx={{
                              cursor: onMateriaClick ? "pointer" : "default",
                            }}
                          >
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
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="center"
                                alignItems="center"
                              >
                                {obtenerIconoEstado(materia.estado)}
                                <Chip
                                  label={materia.estado.toUpperCase()}
                                  color={obtenerColorEstado(materia.estado)}
                                  size="small"
                                />
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No se encontraron materias con los filtros seleccionados
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// Componente auxiliar - Tabla simple sin acordeones
export function TablaHistorialSimple({
  materias,
  title = "Materias",
  onMateriaClick,
}: {
  materias: MateriaHistorial[];
  title?: string;
  onMateriaClick?: (materia: MateriaHistorial) => void;
}) {
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
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
              {materias.map((materia) => (
                <TableRow
                  key={materia.id}
                  hover
                  onClick={() => onMateriaClick && onMateriaClick(materia)}
                  sx={{
                    cursor: onMateriaClick ? "pointer" : "default",
                  }}
                >
                  <TableCell>
                    <Chip
                      label={materia.clave}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MenuBookIcon fontSize="small" color="action" />
                      <Typography variant="body2">{materia.nombre}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {materia.profesor}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{materia.creditos}</TableCell>
                  <TableCell align="center">
                    {materia.estado === "cursando" ? (
                      <Chip label="En curso" size="small" color="default" />
                    ) : (
                      <Chip
                        label={materia.calificacion.toFixed(1)}
                        color={obtenerColorCalificacion(materia.calificacion)}
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
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
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
  Avatar,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Tooltip,
  IconButton,
  TableSortLabel,
  Collapse,
} from "@mui/material";

// Íconos
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Tipos
export interface AsistenciaAlumno {
  id: number;
  matricula: string;
  nombre: string;
  avatar?: string;
  presentes: number;
  ausentes: number;
  retardos: number;
  justificados: number;
  totalClases: number;
  porcentaje: number;
}

export type EstadoAsistencia =
  | "presente"
  | "ausente"
  | "retardo"
  | "justificado";
export type SortField =
  | "nombre"
  | "matricula"
  | "porcentaje"
  | "presentes"
  | "ausentes";
export type SortOrder = "asc" | "desc";

interface TablaAsistenciasProps {
  /**
   * Datos de asistencias por alumno
   */
  data: AsistenciaAlumno[];
  /**
   * Título de la tabla
   */
  title?: string;
  /**
   * Mostrar filtros
   * @default true
   */
  showFilters?: boolean;
  /**
   * Mostrar búsqueda
   * @default true
   */
  showSearch?: boolean;
  /**
   * Mostrar avatares
   * @default true
   */
  showAvatars?: boolean;
  /**
   * Permitir ordenamiento
   * @default true
   */
  sortable?: boolean;
  /**
   * Campo de ordenamiento inicial
   * @default "porcentaje"
   */
  defaultSortField?: SortField;
  /**
   * Orden inicial
   * @default "desc"
   */
  defaultSortOrder?: SortOrder;
  /**
   * Mostrar resumen en footer
   * @default true
   */
  showFooter?: boolean;
  /**
   * Callback cuando se hace click en un alumno
   */
  onAlumnoClick?: (alumno: AsistenciaAlumno) => void;
  /**
   * Tamaño de la tabla
   * @default "medium"
   */
  size?: "small" | "medium";
  /**
   * Umbral de alerta (porcentaje mínimo)
   * @default 80
   */
  alertThreshold?: number;
}

export default function TablaAsistencias({
  data,
  title = "Asistencias por Alumno",
  showFilters = true,
  showSearch = true,
  showAvatars = true,
  sortable = true,
  defaultSortField = "porcentaje",
  defaultSortOrder = "desc",
  showFooter = true,
  onAlumnoClick,
  size = "medium",
  alertThreshold = 80,
}: TablaAsistenciasProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [sortField, setSortField] = useState<SortField>(defaultSortField);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Filtrar y ordenar datos
  const datosProcesados = useMemo(() => {
    let resultado = [...data];

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter(
        (alumno) =>
          alumno.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          alumno.matricula.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter((alumno) => {
        switch (filtroEstado) {
          case "excelente":
            return alumno.porcentaje >= 95;
          case "bueno":
            return alumno.porcentaje >= 85 && alumno.porcentaje < 95;
          case "regular":
            return (
              alumno.porcentaje >= alertThreshold && alumno.porcentaje < 85
            );
          case "bajo":
            return alumno.porcentaje < alertThreshold;
          default:
            return true;
        }
      });
    }

    // Ordenar
    resultado.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "nombre":
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case "matricula":
          comparison = a.matricula.localeCompare(b.matricula);
          break;
        case "porcentaje":
          comparison = a.porcentaje - b.porcentaje;
          break;
        case "presentes":
          comparison = a.presentes - b.presentes;
          break;
        case "ausentes":
          comparison = a.ausentes - b.ausentes;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return resultado;
  }, [data, busqueda, filtroEstado, sortField, sortOrder, alertThreshold]);

  // Calcular totales
  const totales = useMemo(() => {
    return {
      presentes: datosProcesados.reduce((sum, a) => sum + a.presentes, 0),
      ausentes: datosProcesados.reduce((sum, a) => sum + a.ausentes, 0),
      retardos: datosProcesados.reduce((sum, a) => sum + a.retardos, 0),
      justificados: datosProcesados.reduce((sum, a) => sum + a.justificados, 0),
      totalAlumnos: datosProcesados.length,
      promedioAsistencia:
        datosProcesados.length > 0
          ? Math.round(
              datosProcesados.reduce((sum, a) => sum + a.porcentaje, 0) /
                datosProcesados.length
            )
          : 0,
    };
  }, [datosProcesados]);

  // Manejar ordenamiento
  const handleSort = (field: SortField) => {
    if (!sortable) return;

    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Obtener color por porcentaje
  const obtenerColorPorcentaje = (
    porcentaje: number
  ): "success" | "info" | "warning" | "error" => {
    if (porcentaje >= 95) return "success";
    if (porcentaje >= 85) return "info";
    if (porcentaje >= alertThreshold) return "warning";
    return "error";
  };

  // Obtener etiqueta de estado
  const obtenerEtiquetaEstado = (porcentaje: number): string => {
    if (porcentaje >= 95) return "Excelente";
    if (porcentaje >= 85) return "Bueno";
    if (porcentaje >= alertThreshold) return "Regular";
    return "Bajo";
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
            {title} ({datosProcesados.length})
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

        {/* Filtros */}
        <Collapse in={showFiltersPanel}>
          <Box
            sx={{
              mb: 2,
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
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {showSearch && (
                  <TextField
                    size="small"
                    placeholder="Buscar alumno..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    sx={{ minWidth: 250 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                <TextField
                  select
                  size="small"
                  label="Filtrar por rendimiento"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="excelente">Excelente (≥95%)</MenuItem>
                  <MenuItem value="bueno">Bueno (85-94%)</MenuItem>
                  <MenuItem value="regular">
                    Regular ({alertThreshold}-84%)
                  </MenuItem>
                  <MenuItem value="bajo">Bajo (&lt;{alertThreshold}%)</MenuItem>
                </TextField>
              </Stack>
            </Stack>
          </Box>
        </Collapse>

        {/* Tabla */}
        <TableContainer component={Paper} variant="outlined">
          <Table size={size}>
            <TableHead>
              <TableRow>
                <TableCell>
                  {sortable ? (
                    <TableSortLabel
                      active={sortField === "nombre"}
                      direction={sortField === "nombre" ? sortOrder : "asc"}
                      onClick={() => handleSort("nombre")}
                    >
                      Alumno
                    </TableSortLabel>
                  ) : (
                    "Alumno"
                  )}
                </TableCell>
                <TableCell>
                  {sortable ? (
                    <TableSortLabel
                      active={sortField === "matricula"}
                      direction={sortField === "matricula" ? sortOrder : "asc"}
                      onClick={() => handleSort("matricula")}
                    >
                      Matrícula
                    </TableSortLabel>
                  ) : (
                    "Matrícula"
                  )}
                </TableCell>
                <TableCell align="center">
                  {sortable ? (
                    <TableSortLabel
                      active={sortField === "presentes"}
                      direction={sortField === "presentes" ? sortOrder : "asc"}
                      onClick={() => handleSort("presentes")}
                    >
                      Presentes
                    </TableSortLabel>
                  ) : (
                    "Presentes"
                  )}
                </TableCell>
                <TableCell align="center">
                  {sortable ? (
                    <TableSortLabel
                      active={sortField === "ausentes"}
                      direction={sortField === "ausentes" ? sortOrder : "asc"}
                      onClick={() => handleSort("ausentes")}
                    >
                      Ausentes
                    </TableSortLabel>
                  ) : (
                    "Ausentes"
                  )}
                </TableCell>
                <TableCell align="center">Retardos</TableCell>
                <TableCell align="center">Justificados</TableCell>
                <TableCell align="center">Total Clases</TableCell>
                <TableCell align="center">
                  {sortable ? (
                    <TableSortLabel
                      active={sortField === "porcentaje"}
                      direction={sortField === "porcentaje" ? sortOrder : "asc"}
                      onClick={() => handleSort("porcentaje")}
                    >
                      % Asistencia
                    </TableSortLabel>
                  ) : (
                    "% Asistencia"
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosProcesados.length > 0 ? (
                datosProcesados.map((alumno) => (
                  <TableRow
                    key={alumno.id}
                    hover
                    onClick={() => onAlumnoClick && onAlumnoClick(alumno)}
                    sx={{
                      cursor: onAlumnoClick ? "pointer" : "default",
                      bgcolor:
                        alumno.porcentaje < alertThreshold
                          ? "error.lighter"
                          : "inherit",
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {showAvatars && (
                          <Avatar
                            src={alumno.avatar}
                            sx={{ width: 32, height: 32 }}
                          >
                            {alumno.nombre.charAt(0)}
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {alumno.nombre}
                          </Typography>
                          {alumno.porcentaje < alertThreshold && (
                            <Typography variant="caption" color="error">
                              Requiere atención
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alumno.matricula}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CheckCircleIcon fontSize="small" color="success" />
                        <Typography variant="body2" fontWeight="bold">
                          {alumno.presentes}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CancelIcon fontSize="small" color="error" />
                        <Typography variant="body2" fontWeight="bold">
                          {alumno.ausentes}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <AccessTimeIcon fontSize="small" color="warning" />
                        <Typography variant="body2">
                          {alumno.retardos}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <VerifiedIcon fontSize="small" color="info" />
                        <Typography variant="body2">
                          {alumno.justificados}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {alumno.totalClases}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={obtenerEtiquetaEstado(alumno.porcentaje)}>
                        <Chip
                          label={`${alumno.porcentaje}%`}
                          color={obtenerColorPorcentaje(alumno.porcentaje)}
                          sx={{ fontWeight: "bold", minWidth: 65 }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron alumnos
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {/* Footer con totales */}
            {showFooter && datosProcesados.length > 0 && (
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell colSpan={2}>
                    <Typography variant="body2" fontWeight="bold">
                      TOTALES ({totales.totalAlumnos} alumnos)
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {totales.presentes}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="error.main"
                    >
                      {totales.ausentes}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="warning.main"
                    >
                      {totales.retardos}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="info.main"
                    >
                      {totales.justificados}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="bold">
                      -
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${totales.promedioAsistencia}%`}
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
            )}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

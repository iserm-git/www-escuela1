"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  InputAdornment,
  Collapse,
  IconButton,
  Chip,
} from "@mui/material";

// Íconos
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Tipos
export interface FiltrosPeriodo {
  id: number;
  clave: string;
  nombre: string;
}

export interface FiltrosCarrera {
  id: number;
  clave: string;
  nombre: string;
}

export interface FiltrosValues {
  periodoId?: number;
  carreraId?: number;
  busqueda?: string;
  fechaInicio?: string;
  fechaFin?: string;
  [key: string]: any; // Permite campos adicionales personalizados
}

interface FiltrosReporteProps {
  /**
   * Valores actuales de los filtros
   */
  values: FiltrosValues;
  /**
   * Callback cuando cambian los filtros
   */
  onChange: (values: FiltrosValues) => void;
  /**
   * Lista de periodos disponibles
   */
  periodos?: FiltrosPeriodo[];
  /**
   * Lista de carreras disponibles
   */
  carreras?: FiltrosCarrera[];
  /**
   * Mostrar campo de búsqueda
   * @default true
   */
  showBusqueda?: boolean;
  /**
   * Placeholder del campo de búsqueda
   * @default "Buscar..."
   */
  busquedaPlaceholder?: string;
  /**
   * Mostrar selector de periodo
   * @default true
   */
  showPeriodo?: boolean;
  /**
   * Mostrar selector de carrera
   * @default true
   */
  showCarrera?: boolean;
  /**
   * Mostrar selectores de fecha
   * @default false
   */
  showFechas?: boolean;
  /**
   * Filtros adicionales personalizados (render prop)
   */
  renderCustomFilters?: (
    values: FiltrosValues,
    onChange: (values: FiltrosValues) => void
  ) => React.ReactNode;
  /**
   * Permitir colapsar/expandir los filtros
   * @default false
   */
  collapsible?: boolean;
  /**
   * Estado inicial colapsado (solo si collapsible=true)
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Mostrar botón de limpiar filtros
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Mostrar contador de filtros activos
   * @default true
   */
  showActiveFiltersCount?: boolean;
}

// Datos por defecto
const defaultPeriodos: FiltrosPeriodo[] = [
  { id: 1, clave: "2025-1", nombre: "Enero - Junio 2025" },
  { id: 2, clave: "2024-2", nombre: "Agosto - Diciembre 2024" },
  { id: 3, clave: "2024-1", nombre: "Enero - Junio 2024" },
];

const defaultCarreras: FiltrosCarrera[] = [
  { id: 0, clave: "TODAS", nombre: "Todas las carreras" },
  { id: 1, clave: "ISC", nombre: "Ing. en Sistemas Computacionales" },
  { id: 2, clave: "ITIC", nombre: "Ing. en Tecnologías de Información" },
  { id: 3, clave: "IIND", nombre: "Ing. Industrial" },
  { id: 4, clave: "IGE", nombre: "Ing. en Gestión Empresarial" },
];

export default function FiltrosReporte({
  values,
  onChange,
  periodos = defaultPeriodos,
  carreras = defaultCarreras,
  showBusqueda = true,
  busquedaPlaceholder = "Buscar...",
  showPeriodo = true,
  showCarrera = true,
  showFechas = false,
  renderCustomFilters,
  collapsible = false,
  defaultCollapsed = false,
  showClearButton = true,
  showActiveFiltersCount = true,
}: FiltrosReporteProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);

  // Manejar cambios en los campos
  const handleChange = (field: string, value: any) => {
    onChange({
      ...values,
      [field]: value,
    });
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    onChange({
      periodoId: periodos[0]?.id,
      carreraId: 0,
      busqueda: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  // Contar filtros activos
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (values.busqueda && values.busqueda.trim() !== "") count++;
    if (values.carreraId && values.carreraId !== 0) count++;
    if (values.fechaInicio) count++;
    if (values.fechaFin) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardContent>
        {/* Header de filtros */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: collapsible && !isExpanded ? 0 : 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListIcon />
            <Typography variant="h6" fontWeight="bold">
              Filtros
            </Typography>
            {showActiveFiltersCount && activeFiltersCount > 0 && (
              <Chip
                label={`${activeFiltersCount} activo${
                  activeFiltersCount > 1 ? "s" : ""
                }`}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {showClearButton && activeFiltersCount > 0 && (
              <Button
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
                variant="outlined"
              >
                Limpiar
              </Button>
            )}
            {collapsible && (
              <IconButton
                onClick={() => setIsExpanded(!isExpanded)}
                size="small"
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* Contenido de filtros */}
        <Collapse in={isExpanded} timeout="auto">
          <Grid container spacing={2}>
            {/* Selector de Periodo */}
            {showPeriodo && (
              <Grid
                item
                xs={12}
                md={showFechas ? 3 : showCarrera && showBusqueda ? 4 : 6}
              >
                <TextField
                  select
                  fullWidth
                  label="Periodo Lectivo"
                  value={values.periodoId || periodos[0]?.id || ""}
                  onChange={(e) =>
                    handleChange("periodoId", Number(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {periodos.map((periodo) => (
                    <MenuItem key={periodo.id} value={periodo.id}>
                      {periodo.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Selector de Carrera */}
            {showCarrera && (
              <Grid
                item
                xs={12}
                md={showFechas ? 3 : showPeriodo && showBusqueda ? 4 : 6}
              >
                <TextField
                  select
                  fullWidth
                  label="Carrera"
                  value={values.carreraId ?? 0}
                  onChange={(e) =>
                    handleChange("carreraId", Number(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {carreras.map((carrera) => (
                    <MenuItem key={carrera.id} value={carrera.id}>
                      {carrera.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Campo de Búsqueda */}
            {showBusqueda && (
              <Grid
                item
                xs={12}
                md={showFechas ? 3 : showPeriodo && showCarrera ? 4 : 6}
              >
                <TextField
                  fullWidth
                  label="Buscar"
                  value={values.busqueda || ""}
                  onChange={(e) => handleChange("busqueda", e.target.value)}
                  placeholder={busquedaPlaceholder}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: values.busqueda && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => handleChange("busqueda", "")}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            {/* Fechas */}
            {showFechas && (
              <>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha Inicio"
                    value={values.fechaInicio || ""}
                    onChange={(e) =>
                      handleChange("fechaInicio", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha Fin"
                    value={values.fechaFin || ""}
                    onChange={(e) => handleChange("fechaFin", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
            )}

            {/* Filtros personalizados */}
            {renderCustomFilters && renderCustomFilters(values, onChange)}
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Stack,
  Button,
  Chip,
  Menu,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";

// Íconos
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ClearIcon from "@mui/icons-material/Clear";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";

// Tipos
export interface DateRange {
  startDate: string; // ISO format: "2025-01-01"
  endDate: string; // ISO format: "2025-01-31"
}

export type PresetRange =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "custom";

interface DateRangePickerProps {
  /**
   * Rango de fechas actual
   */
  value: DateRange;
  /**
   * Callback cuando cambia el rango
   */
  onChange: (range: DateRange) => void;
  /**
   * Mostrar presets rápidos
   * @default true
   */
  showPresets?: boolean;
  /**
   * Presets personalizados disponibles
   */
  presets?: PresetRange[];
  /**
   * Etiquetas para los campos
   */
  labels?: {
    startDate?: string;
    endDate?: string;
  };
  /**
   * Fecha mínima permitida
   */
  minDate?: string;
  /**
   * Fecha máxima permitida
   */
  maxDate?: string;
  /**
   * Mostrar botón de limpiar
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Tamaño de los campos
   * @default "medium"
   */
  size?: "small" | "medium";
  /**
   * Diseño
   * @default "horizontal"
   */
  layout?: "horizontal" | "vertical";
  /**
   * Deshabilitar el componente
   * @default false
   */
  disabled?: boolean;
  /**
   * Mostrar chips con el rango seleccionado
   * @default false
   */
  showChips?: boolean;
  /**
   * Variante del campo
   * @default "outlined"
   */
  variant?: "outlined" | "filled" | "standard";
}

// Configuración de presets
const presetConfig: Record<
  PresetRange,
  { label: string; icon: React.ReactNode }
> = {
  today: { label: "Hoy", icon: <TodayIcon fontSize="small" /> },
  yesterday: { label: "Ayer", icon: <CalendarTodayIcon fontSize="small" /> },
  last7days: {
    label: "Últimos 7 días",
    icon: <DateRangeIcon fontSize="small" />,
  },
  last30days: {
    label: "Últimos 30 días",
    icon: <DateRangeIcon fontSize="small" />,
  },
  thisWeek: {
    label: "Esta semana",
    icon: <CalendarTodayIcon fontSize="small" />,
  },
  thisMonth: {
    label: "Este mes",
    icon: <CalendarTodayIcon fontSize="small" />,
  },
  lastMonth: {
    label: "Mes anterior",
    icon: <CalendarTodayIcon fontSize="small" />,
  },
  thisYear: { label: "Este año", icon: <CalendarTodayIcon fontSize="small" /> },
  custom: { label: "Personalizado", icon: <DateRangeIcon fontSize="small" /> },
};

export default function DateRangePicker({
  value,
  onChange,
  showPresets = true,
  presets = [
    "today",
    "yesterday",
    "last7days",
    "last30days",
    "thisMonth",
    "custom",
  ],
  labels = { startDate: "Fecha Inicio", endDate: "Fecha Fin" },
  minDate,
  maxDate,
  showClearButton = true,
  size = "medium",
  layout = "horizontal",
  disabled = false,
  showChips = false,
  variant = "outlined",
}: DateRangePickerProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetRange>("custom");

  const openMenu = Boolean(anchorEl);

  // Calcular rango según preset
  const calculatePresetRange = (preset: PresetRange): DateRange => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date = new Date(today);

    switch (preset) {
      case "today":
        startDate = new Date(today);
        endDate = new Date(today);
        break;

      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
        break;

      case "last7days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        endDate = new Date(today);
        break;

      case "last30days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 29);
        endDate = new Date(today);
        break;

      case "thisWeek":
        startDate = new Date(today);
        const dayOfWeek = startDate.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Lunes como inicio
        startDate.setDate(startDate.getDate() + diff);
        endDate = new Date(today);
        break;

      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;

      case "lastMonth":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today);
        break;

      default:
        return value;
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  // Manejar selección de preset
  const handlePresetSelect = (preset: PresetRange) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      const newRange = calculatePresetRange(preset);
      onChange(newRange);
    }
    setAnchorEl(null);
  };

  // Manejar cambio manual de fechas
  const handleDateChange = (
    field: "startDate" | "endDate",
    newValue: string
  ) => {
    const newRange = { ...value, [field]: newValue };
    onChange(newRange);
    setSelectedPreset("custom");
  };

  // Limpiar fechas
  const handleClear = () => {
    const emptyRange: DateRange = { startDate: "", endDate: "" };
    onChange(emptyRange);
    setSelectedPreset("custom");
  };

  // Formatear fecha para mostrar
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calcular días entre fechas
  const getDaysBetween = (): number => {
    if (!value.startDate || !value.endDate) return 0;
    const start = new Date(value.startDate + "T00:00:00");
    const end = new Date(value.endDate + "T00:00:00");
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Incluye ambos días
  };

  return (
    <Box>
      <Stack spacing={2}>
        {/* Presets y botón de limpiar */}
        {showPresets && (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            alignItems="center"
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalendarTodayIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              disabled={disabled}
            >
              {presetConfig[selectedPreset].label}
            </Button>

            {showClearButton && (value.startDate || value.endDate) && (
              <Tooltip title="Limpiar fechas">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  disabled={disabled}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* Chips con rango seleccionado */}
            {showChips && value.startDate && value.endDate && (
              <Chip
                label={`${getDaysBetween()} ${
                  getDaysBetween() === 1 ? "día" : "días"
                }`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        )}

        {/* Campos de fecha */}
        <Stack
          direction={layout === "horizontal" ? "row" : "column"}
          spacing={2}
        >
          <TextField
            type="date"
            label={labels.startDate}
            value={value.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            fullWidth
            size={size}
            variant={variant}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: minDate,
              max: value.endDate || maxDate,
            }}
          />

          <TextField
            type="date"
            label={labels.endDate}
            value={value.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            fullWidth
            size={size}
            variant={variant}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: value.startDate || minDate,
              max: maxDate,
            }}
          />
        </Stack>

        {/* Información del rango */}
        {value.startDate && value.endDate && (
          <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "action.hover" }}>
            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                Rango seleccionado:
              </Typography>
              <Typography variant="body2">
                {formatDateForDisplay(value.startDate)} -{" "}
                {formatDateForDisplay(value.endDate)}
              </Typography>
              <Typography variant="caption" color="primary.main">
                {getDaysBetween()} {getDaysBetween() === 1 ? "día" : "días"} de
                datos
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>

      {/* Menú de presets */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="bold"
          >
            PERÍODOS RÁPIDOS
          </Typography>
        </Box>
        <Divider />
        {presets.map((preset) => (
          <MenuItem
            key={preset}
            onClick={() => handlePresetSelect(preset)}
            selected={selectedPreset === preset}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {presetConfig[preset].icon}
              <Typography variant="body2">
                {presetConfig[preset].label}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

// Componente auxiliar - Selector simple de fecha única
export function SimpleDatePicker({
  value,
  onChange,
  label = "Fecha",
  minDate,
  maxDate,
  size = "medium",
  variant = "outlined",
  disabled = false,
}: {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  minDate?: string;
  maxDate?: string;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
}) {
  return (
    <TextField
      type="date"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size={size}
      variant={variant}
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      inputProps={{
        min: minDate,
        max: maxDate,
      }}
    />
  );
}

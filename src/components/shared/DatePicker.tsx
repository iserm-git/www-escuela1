"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Clear as ClearIcon,
  Today as TodayIcon,
} from "@mui/icons-material";

interface DatePickerProps
  extends Omit<TextFieldProps, "type" | "onChange" | "value"> {
  value?: string; // Formato ISO: "YYYY-MM-DD"
  onChange: (value: string) => void;
  minDate?: string; // Formato ISO: "YYYY-MM-DD"
  maxDate?: string; // Formato ISO: "YYYY-MM-DD"
  disableFuture?: boolean; // No permite fechas futuras
  disablePast?: boolean; // No permite fechas pasadas
  showClearButton?: boolean; // Mostrar botón para limpiar
  showTodayButton?: boolean; // Mostrar botón para hoy
  locale?: string; // Locale para formato (default: "es-MX")
  helperTextOnError?: boolean; // Mostrar helper text solo en error
}

export default function DatePicker({
  value = "",
  onChange,
  minDate,
  maxDate,
  disableFuture = false,
  disablePast = false,
  showClearButton = true,
  showTodayButton = true,
  locale = "es-MX",
  helperTextOnError = false,
  helperText,
  error,
  ...otherProps
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [validationError, setValidationError] = useState("");

  // Sincronizar con prop value externa
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Calcular límites automáticos
  const getMinDate = () => {
    if (minDate) return minDate;
    if (disablePast) return new Date().toISOString().split("T")[0];
    return undefined;
  };

  const getMaxDate = () => {
    if (maxDate) return maxDate;
    if (disableFuture) return new Date().toISOString().split("T")[0];
    return undefined;
  };

  const minDateValue = getMinDate();
  const maxDateValue = getMaxDate();

  // Validar fecha
  const validateDate = (dateString: string): string => {
    if (!dateString) {
      setValidationError("");
      return "";
    }

    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validar formato
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    // Validar futuro
    if (disableFuture && date > today) {
      return "No se permiten fechas futuras";
    }

    // Validar pasado
    if (disablePast && date < today) {
      return "No se permiten fechas pasadas";
    }

    // Validar mínimo
    if (minDateValue && dateString < minDateValue) {
      return `La fecha debe ser posterior a ${formatDate(minDateValue)}`;
    }

    // Validar máximo
    if (maxDateValue && dateString > maxDateValue) {
      return `La fecha debe ser anterior a ${formatDate(maxDateValue)}`;
    }

    return "";
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Manejar cambio de fecha
  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    const error = validateDate(newValue);
    setValidationError(error);

    // Solo llamar onChange si no hay error o si está vacío
    if (!error || !newValue) {
      onChange(newValue);
    }
  };

  // Limpiar fecha
  const handleClear = () => {
    setInternalValue("");
    setValidationError("");
    onChange("");
  };

  // Establecer hoy
  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    handleChange(today);
  };

  // Determinar si mostrar helper text
  const shouldShowHelperText = () => {
    if (validationError) return true;
    if (helperTextOnError && !error) return false;
    return !!helperText;
  };

  const displayHelperText = validationError || helperText;
  const hasError = error || !!validationError;

  return (
    <TextField
      {...otherProps}
      type="date"
      value={internalValue}
      onChange={(e) => handleChange(e.target.value)}
      error={hasError}
      helperText={shouldShowHelperText() ? displayHelperText : undefined}
      InputLabelProps={{
        shrink: true,
        ...otherProps.InputLabelProps,
      }}
      inputProps={{
        min: minDateValue,
        max: maxDateValue,
        ...otherProps.inputProps,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CalendarIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {showTodayButton && (
              <Tooltip title="Hoy">
                <IconButton
                  size="small"
                  onClick={handleToday}
                  edge="end"
                  sx={{ mr: showClearButton && internalValue ? 0.5 : 0 }}
                >
                  <TodayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {showClearButton && internalValue && (
              <Tooltip title="Limpiar">
                <IconButton size="small" onClick={handleClear} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </InputAdornment>
        ),
        ...otherProps.InputProps,
      }}
    />
  );
}

// ========================================
// VARIANTE: DateRangePicker
// ========================================

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  label?: string;
  required?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  disableFuture?: boolean;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label = "Rango de Fechas",
  required = false,
  size = "medium",
  fullWidth = false,
  disableFuture = false,
}: DateRangePickerProps) {
  return (
    <div>
      {label && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
          {required && " *"}
        </Typography>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <DatePicker
          label="Fecha Inicio"
          value={startDate}
          onChange={onStartDateChange}
          maxDate={endDate || undefined}
          disableFuture={disableFuture}
          size={size}
          fullWidth={fullWidth}
          required={required}
        />
        <DatePicker
          label="Fecha Fin"
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate || undefined}
          disableFuture={disableFuture}
          size={size}
          fullWidth={fullWidth}
          required={required}
        />
      </Stack>
    </div>
  );
}

// ========================================
// UTILIDADES
// ========================================

export const dateUtils = {
  // Obtener fecha de hoy en formato ISO
  today(): string {
    return new Date().toISOString().split("T")[0];
  },

  // Formatear fecha a texto legible
  format(dateString: string, locale = "es-MX"): string {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  },

  // Formatear fecha corta
  formatShort(dateString: string, locale = "es-MX"): string {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  },

  // Agregar días a una fecha
  addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  },

  // Restar días a una fecha
  subtractDays(dateString: string, days: number): string {
    return this.addDays(dateString, -days);
  },

  // Calcular diferencia en días
  diffDays(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Verificar si es fecha válida
  isValid(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  },

  // Obtener inicio de semana
  startOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Lunes
    date.setDate(diff);
    return date.toISOString().split("T")[0];
  },

  // Obtener fin de semana
  endOfWeek(dateString: string): string {
    const startDate = this.startOfWeek(dateString);
    return this.addDays(startDate, 6);
  },

  // Obtener inicio de mes
  startOfMonth(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(1);
    return date.toISOString().split("T")[0];
  },

  // Obtener fin de mes
  endOfMonth(dateString: string): string {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.toISOString().split("T")[0];
  },
};

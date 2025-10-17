"use client";

import { useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  Button,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import DatePicker from "./DatePicker";
import DatePresets from "./DatePresets";

interface DateFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  showPresets?: boolean;
  collapsible?: boolean;
  title?: string;
}

export function DateFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
  showPresets = true,
  collapsible = true,
  title = "Filtros de Fecha",
}: DateFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  const handlePresetSelect = (start: string, end: string) => {
    onStartDateChange(start);
    onEndDateChange(end);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={expanded ? 2 : 0}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterIcon color="action" />
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
        </Stack>
        {collapsible && (
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Stack>

      <Collapse in={expanded}>
        <Stack spacing={2}>
          {showPresets && (
            <>
              <Typography variant="caption" color="text.secondary">
                Accesos Rápidos:
              </Typography>
              <DatePresets
                onSelect={handlePresetSelect}
                variant="chips"
                size="small"
              />
            </>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DatePicker
              label="Fecha Inicio"
              value={startDate}
              onChange={onStartDateChange}
              maxDate={endDate || undefined}
              disableFuture
              fullWidth
            />
            <DatePicker
              label="Fecha Fin"
              value={endDate}
              onChange={onEndDateChange}
              minDate={startDate || undefined}
              disableFuture
              fullWidth
            />
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={onClear}>
              Limpiar
            </Button>
            <Button size="small" variant="contained" onClick={onApply}>
              Aplicar
            </Button>
          </Stack>
        </Stack>
      </Collapse>
    </Paper>
  );
}

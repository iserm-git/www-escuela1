"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import type {
  AsistenciaFiltros,
  EstadoAsistencia,
} from "@/types/gestion-curso";

interface AsistenciaFiltersProps {
  filtros: AsistenciaFiltros;
  onChange: (filtros: AsistenciaFiltros) => void;
  onApply: () => void;
  onClear: () => void;
  collapsible?: boolean;
}

export default function AsistenciaFilters({
  filtros,
  onChange,
  onApply,
  onClear,
  collapsible = true,
}: AsistenciaFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  const handleChange = (field: keyof AsistenciaFiltros, value: any) => {
    onChange({ ...filtros, [field]: value || undefined });
  };

  // Mock data - reemplazar con datos de API
  const grupos = [
    { id: 1, nombre: "1A" },
    { id: 2, nombre: "2B" },
    { id: 3, nombre: "3C" },
  ];

  const materias = [
    { id: 1, nombre: "Lenguajes Web" },
    { id: 2, nombre: "Bases de Datos" },
    { id: 3, nombre: "Programación Móvil" },
  ];

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
            Filtros
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
          >
            <TextField
              label="Fecha Inicio"
              type="date"
              size="small"
              value={filtros.fecha_inicio || ""}
              onChange={(e) => handleChange("fecha_inicio", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />

            <TextField
              label="Fecha Fin"
              type="date"
              size="small"
              value={filtros.fecha_fin || ""}
              onChange={(e) => handleChange("fecha_fin", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />

            <TextField
              select
              label="Estado"
              size="small"
              value={filtros.estado || ""}
              onChange={(e) =>
                handleChange("estado", e.target.value as EstadoAsistencia)
              }
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="presente">Presente</MenuItem>
              <MenuItem value="ausente">Ausente</MenuItem>
              <MenuItem value="retardo">Retardo</MenuItem>
              <MenuItem value="justificado">Justificado</MenuItem>
            </TextField>

            <TextField
              select
              label="Grupo"
              size="small"
              value={filtros.grupo_id || ""}
              onChange={(e) => handleChange("grupo_id", Number(e.target.value))}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">Todos</MenuItem>
              {grupos.map((grupo) => (
                <MenuItem key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Materia"
              size="small"
              value={filtros.materia_id || ""}
              onChange={(e) =>
                handleChange("materia_id", Number(e.target.value))
              }
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todas</MenuItem>
              {materias.map((materia) => (
                <MenuItem key={materia.id} value={materia.id}>
                  {materia.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={onClear}
            >
              Limpiar
            </Button>
            <Button variant="contained" size="small" onClick={onApply}>
              Aplicar Filtros
            </Button>
          </Stack>
        </Stack>
      </Collapse>
    </Paper>
  );
}

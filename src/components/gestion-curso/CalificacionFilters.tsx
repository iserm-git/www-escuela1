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
import type { CalificacionFiltros, Evaluacion } from "@/types/gestion-curso";

interface CalificacionFiltersProps {
  filtros: CalificacionFiltros;
  evaluaciones: Evaluacion[];
  onChange: (filtros: CalificacionFiltros) => void;
  onApply: () => void;
  onClear: () => void;
  collapsible?: boolean;
}

export default function CalificacionFilters({
  filtros,
  evaluaciones,
  onChange,
  onApply,
  onClear,
  collapsible = true,
}: CalificacionFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  const handleChange = (field: keyof CalificacionFiltros, value: any) => {
    onChange({ ...filtros, [field]: value || undefined });
  };

  // Mock data
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

            <TextField
              select
              label="Evaluación"
              size="small"
              value={filtros.evaluacion_id || ""}
              onChange={(e) =>
                handleChange("evaluacion_id", Number(e.target.value))
              }
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">Todas</MenuItem>
              {evaluaciones.map((evaluacion) => (
                <MenuItem key={evaluacion.id} value={evaluacion.id}>
                  {evaluacion.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Buscar Alumno"
              size="small"
              placeholder="Nombre o matrícula"
              value={filtros.alumno_id || ""}
              onChange={(e) =>
                handleChange("alumno_id", Number(e.target.value))
              }
              sx={{ minWidth: 200 }}
            />
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

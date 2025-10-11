"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

type MateriaData = {
  id?: number;
  clave: string;
  nombre: string;
  creditos: number;
  carrera?: string;
};

type MateriaDialogProps = {
  open: boolean;
  initial?: MateriaData | null;
  onClose: () => void;
  onSave: (materia: MateriaData) => void;
};

// Carreras del TecNM
const CARRERAS = [
  { value: "ISC", label: "Ingeniería en Sistemas Computacionales" },
  {
    value: "ITIC",
    label: "Ingeniería en Tecnologías de la Información y Comunicaciones",
  },
  { value: "IIND", label: "Ingeniería Industrial" },
  { value: "CP", label: "Contador Público" },
  { value: "IIA", label: "Ingeniería en Industrias Alimentarias" },
  { value: "IGE", label: "Ingeniería en Gestión Empresarial" },
  { value: "IE", label: "Ingeniería Electromecánica" },
  { value: "IIAS", label: "Ingeniería en Innovación Agrícola Sustentable" },
  { value: "ARQ", label: "Arquitectura" },
];

export default function MateriaDialog({
  open,
  initial,
  onClose,
  onSave,
}: MateriaDialogProps) {
  // Estados del formulario
  const [clave, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [creditos, setCreditos] = useState<number>(5);
  const [carrera, setCarrera] = useState("");

  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sincronizar con datos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setClave(initial?.clave ?? "");
      setNombre(initial?.nombre ?? "");
      setCreditos(initial?.creditos ?? 5);
      setCarrera(initial?.carrera ?? "");
      setErrors({});
    }
  }, [open, initial]);

  // Validación de campos
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clave.trim()) {
      newErrors.clave = "La clave de materia es obligatoria";
    } else if (!/^[A-Z]{3}-[0-9]{4}$/i.test(clave.trim())) {
      newErrors.clave = "Formato inválido. Use: XXX-0000 (Ej: SCD-1015)";
    }

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre de la materia es obligatorio";
    } else if (nombre.trim().length < 5) {
      newErrors.nombre = "El nombre debe tener al menos 5 caracteres";
    }

    if (!creditos || creditos < 1 || creditos > 12) {
      newErrors.creditos = "Los créditos deben estar entre 1 y 12";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler de guardado
  const handleSave = () => {
    if (!validate()) return;

    const materiaData: MateriaData = {
      clave: clave.trim().toUpperCase(),
      nombre: nombre.trim(),
      creditos: Number(creditos),
      carrera: carrera || undefined,
    };

    // Si es edición, incluir el ID
    if (initial?.id) {
      materiaData.id = initial.id;
    }

    onSave(materiaData);
  };

  // Limpiar error cuando se edita un campo
  const handleFieldChange = (field: string, value: string | number) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    switch (field) {
      case "clave":
        setClave(value as string);
        break;
      case "nombre":
        setNombre(value as string);
        break;
      case "creditos":
        setCreditos(value as number);
        break;
      case "carrera":
        setCarrera(value as string);
        break;
    }
  };

  // Soporte para Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      onKeyDown={handleKeyDown}
    >
      <DialogTitle>
        {initial?.id ? "Editar Materia" : "Nueva Materia"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Clave de Materia */}
          <TextField
            label="Clave de Materia"
            fullWidth
            required
            autoFocus
            value={clave}
            onChange={(e) => handleFieldChange("clave", e.target.value)}
            error={Boolean(errors.clave)}
            helperText={errors.clave || "Formato: XXX-0000 (Ej: SCD-1015)"}
            placeholder="ABC-1234"
            inputProps={{
              style: { textTransform: "uppercase" },
              maxLength: 8,
            }}
          />

          {/* Nombre de la Materia */}
          <TextField
            label="Nombre de la Materia"
            fullWidth
            required
            value={nombre}
            onChange={(e) => handleFieldChange("nombre", e.target.value)}
            error={Boolean(errors.nombre)}
            helperText={
              errors.nombre || "Ej: Programación Web, Cálculo Diferencial"
            }
            placeholder="Ingresa el nombre de la materia"
          />

          {/* Créditos */}
          <TextField
            label="Créditos"
            fullWidth
            required
            type="number"
            value={creditos}
            onChange={(e) =>
              handleFieldChange("creditos", Number(e.target.value))
            }
            error={Boolean(errors.creditos)}
            helperText={errors.creditos || "Número de créditos (1-12)"}
            placeholder="5"
            inputProps={{
              min: 1,
              max: 12,
              step: 1,
            }}
          />

          {/* Carrera */}
          <FormControl fullWidth error={Boolean(errors.carrera)}>
            <InputLabel id="carrera-select-label">Carrera</InputLabel>
            <Select
              labelId="carrera-select-label"
              id="carrera-select"
              value={carrera}
              label="Carrera"
              onChange={(e) => handleFieldChange("carrera", e.target.value)}
            >
              <MenuItem value="">
                <em>General / Todas las carreras</em>
              </MenuItem>
              {CARRERAS.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
            {errors.carrera && (
              <FormHelperText>{errors.carrera}</FormHelperText>
            )}
            {!errors.carrera && (
              <FormHelperText>
                Opcional: Asignar a una carrera específica
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {initial?.id ? "Guardar Cambios" : "Crear Materia"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

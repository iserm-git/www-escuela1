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
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@mui/material";

type ProfesorData = {
  id?: number;
  clave: string;
  nombre: string;
  apellidos: string;
  carrera?: string;
  activo?: boolean;
};

type ProfesorDialogProps = {
  open: boolean;
  initial?: ProfesorData | null;
  onClose: () => void;
  onSave: (profesor: ProfesorData) => void;
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

export default function ProfesorDialog({
  open,
  initial,
  onClose,
  onSave,
}: ProfesorDialogProps) {
  // Estados del formulario
  const [clave, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [carrera, setCarrera] = useState("");
  const [activo, setActivo] = useState(true);

  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sincronizar con datos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setClave(initial?.clave ?? "");
      setNombre(initial?.nombre ?? "");
      setApellidos(initial?.apellidos ?? "");
      setCarrera(initial?.carrera ?? "");
      setActivo(initial?.activo ?? true);
      setErrors({});
    }
  }, [open, initial]);

  // Validación de campos
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clave.trim()) {
      newErrors.clave = "La clave de profesor es obligatoria";
    } else if (!/^[A-Z0-9]+$/i.test(clave.trim())) {
      newErrors.clave = "La clave solo puede contener letras y números";
    }

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    } else if (apellidos.trim().length < 3) {
      newErrors.apellidos = "Los apellidos deben tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler de guardado
  const handleSave = () => {
    if (!validate()) return;

    const profesorData: ProfesorData = {
      clave: clave.trim().toUpperCase(),
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      carrera: carrera || undefined,
      activo,
    };

    // Si es edición, incluir el ID
    if (initial?.id) {
      profesorData.id = initial.id;
    }

    onSave(profesorData);
  };

  // Limpiar error cuando se edita un campo
  const handleFieldChange = (field: string, value: string | boolean) => {
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
      case "apellidos":
        setApellidos(value as string);
        break;
      case "carrera":
        setCarrera(value as string);
        break;
      case "activo":
        setActivo(value as boolean);
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
        {initial?.id ? "Editar Profesor" : "Nuevo Profesor"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Clave de Profesor */}
          <TextField
            label="Clave de Profesor"
            fullWidth
            required
            autoFocus
            value={clave}
            onChange={(e) => handleFieldChange("clave", e.target.value)}
            error={Boolean(errors.clave)}
            helperText={errors.clave || "Ej: PROF001, ISC001"}
            placeholder="Código de profesor"
            inputProps={{
              style: { textTransform: "uppercase" },
              maxLength: 20,
            }}
          />

          {/* Nombre */}
          <TextField
            label="Nombre"
            fullWidth
            required
            value={nombre}
            onChange={(e) => handleFieldChange("nombre", e.target.value)}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre || "Ej: Juan, María"}
            placeholder="Ingresa el nombre"
          />

          {/* Apellidos */}
          <TextField
            label="Apellidos"
            fullWidth
            required
            value={apellidos}
            onChange={(e) => handleFieldChange("apellidos", e.target.value)}
            error={Boolean(errors.apellidos)}
            helperText={errors.apellidos || "Ej: García López, Pérez Sánchez"}
            placeholder="Ingresa los apellidos"
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
                <em>Sin asignar</em>
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
          </FormControl>

          {/* Estado Activo/Inactivo */}
          <FormControlLabel
            control={
              <Switch
                checked={activo}
                onChange={(e) => handleFieldChange("activo", e.target.checked)}
                color="success"
              />
            }
            label={activo ? "Profesor Activo" : "Profesor Inactivo"}
            sx={{
              ".MuiFormControlLabel-label": {
                fontWeight: activo ? 500 : 400,
                color: activo ? "success.main" : "text.secondary",
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {initial?.id ? "Guardar Cambios" : "Crear Profesor"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

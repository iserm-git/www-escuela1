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

type GrupoData = {
  id?: number;
  clave: string;
  nombre: string;
  carrera: string;
  limite_alumnos: number;
  alumnos_inscritos?: number;
};

type GrupoDialogProps = {
  open: boolean;
  initial?: GrupoData | null;
  onClose: () => void;
  onSave: (grupo: GrupoData) => void;
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

export default function GrupoDialog({
  open,
  initial,
  onClose,
  onSave,
}: GrupoDialogProps) {
  // Estados del formulario
  const [clave, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [carrera, setCarrera] = useState("");
  const [limiteAlumnos, setLimiteAlumnos] = useState<number>(30);
  const [alumnosInscritos, setAlumnosInscritos] = useState<number>(0);

  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sincronizar con datos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setClave(initial?.clave ?? "");
      setNombre(initial?.nombre ?? "");
      setCarrera(initial?.carrera ?? "");
      setLimiteAlumnos(initial?.limite_alumnos ?? 30);
      setAlumnosInscritos(initial?.alumnos_inscritos ?? 0);
      setErrors({});
    }
  }, [open, initial]);

  // Validación de campos
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clave.trim()) {
      newErrors.clave = "La clave del grupo es obligatoria";
    } else if (!/^[A-Z]{2,4}-[0-9]{1}[A-Z]$/i.test(clave.trim())) {
      newErrors.clave = "Formato inválido. Use: XXX-0A (Ej: ISC-1A)";
    }

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre del grupo es obligatorio";
    } else if (nombre.trim().length < 5) {
      newErrors.nombre = "El nombre debe tener al menos 5 caracteres";
    }

    if (!carrera) {
      newErrors.carrera = "Debe seleccionar una carrera";
    }

    if (!limiteAlumnos || limiteAlumnos < 10 || limiteAlumnos > 50) {
      newErrors.limite_alumnos =
        "El límite de alumnos debe estar entre 10 y 50";
    }

    if (alumnosInscritos < 0 || alumnosInscritos > limiteAlumnos) {
      newErrors.alumnos_inscritos =
        "Los alumnos inscritos no pueden exceder el límite";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler de guardado
  const handleSave = () => {
    if (!validate()) return;

    const grupoData: GrupoData = {
      clave: clave.trim().toUpperCase(),
      nombre: nombre.trim(),
      carrera: carrera,
      limite_alumnos: Number(limiteAlumnos),
      alumnos_inscritos: Number(alumnosInscritos),
    };

    // Si es edición, incluir el ID
    if (initial?.id) {
      grupoData.id = initial.id;
    }

    onSave(grupoData);
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
      case "carrera":
        setCarrera(value as string);
        break;
      case "limite_alumnos":
        setLimiteAlumnos(value as number);
        break;
      case "alumnos_inscritos":
        setAlumnosInscritos(value as number);
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
      <DialogTitle>{initial?.id ? "Editar Grupo" : "Nuevo Grupo"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Clave del Grupo */}
          <TextField
            label="Clave del Grupo"
            fullWidth
            required
            autoFocus
            value={clave}
            onChange={(e) => handleFieldChange("clave", e.target.value)}
            error={Boolean(errors.clave)}
            helperText={errors.clave || "Formato: XXX-0A (Ej: ISC-1A, ITIC-3B)"}
            placeholder="ISC-1A"
            inputProps={{
              style: { textTransform: "uppercase" },
              maxLength: 10,
            }}
          />

          {/* Nombre del Grupo */}
          <TextField
            label="Nombre del Grupo"
            fullWidth
            required
            value={nombre}
            onChange={(e) => handleFieldChange("nombre", e.target.value)}
            error={Boolean(errors.nombre)}
            helperText={
              errors.nombre || "Ej: 1er Semestre Grupo A, 5to Semestre Grupo B"
            }
            placeholder="Ingresa el nombre del grupo"
          />

          {/* Carrera */}
          <FormControl fullWidth required error={Boolean(errors.carrera)}>
            <InputLabel id="carrera-select-label">Carrera</InputLabel>
            <Select
              labelId="carrera-select-label"
              id="carrera-select"
              value={carrera}
              label="Carrera"
              onChange={(e) => handleFieldChange("carrera", e.target.value)}
            >
              <MenuItem value="">
                <em>Selecciona una carrera</em>
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
                Selecciona la carrera a la que pertenece el grupo
              </FormHelperText>
            )}
          </FormControl>

          {/* Límite de Alumnos */}
          <TextField
            label="Límite de Alumnos"
            fullWidth
            required
            type="number"
            value={limiteAlumnos}
            onChange={(e) =>
              handleFieldChange("limite_alumnos", Number(e.target.value))
            }
            error={Boolean(errors.limite_alumnos)}
            helperText={
              errors.limite_alumnos ||
              "Capacidad máxima del grupo (10-50 alumnos)"
            }
            placeholder="30"
            inputProps={{
              min: 10,
              max: 50,
              step: 1,
            }}
          />

          {/* Alumnos Inscritos - Solo mostrar en edición */}
          {initial?.id && (
            <TextField
              label="Alumnos Inscritos"
              fullWidth
              type="number"
              value={alumnosInscritos}
              onChange={(e) =>
                handleFieldChange("alumnos_inscritos", Number(e.target.value))
              }
              error={Boolean(errors.alumnos_inscritos)}
              helperText={
                errors.alumnos_inscritos ||
                "Número actual de alumnos inscritos en el grupo"
              }
              placeholder="0"
              inputProps={{
                min: 0,
                max: limiteAlumnos,
                step: 1,
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {initial?.id ? "Guardar Cambios" : "Crear Grupo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";

type Alumno = { id?: number; nombre: string; matricula: string };

export default function AlumnoDialog({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Alumno | null;
  onClose: () => void;
  onSave: (a: Alumno) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [matricula, setMatricula] = useState("");

  useEffect(() => {
    setNombre(initial?.nombre ?? "");
    setMatricula(initial?.matricula ?? "");
  }, [initial]);

  const handleSave = () => {
    if (!nombre.trim() || !matricula.trim()) return;
    onSave({ id: initial?.id, nombre, matricula });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial?.id ? "Editar Alumno" : "Nuevo Alumno"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
          />
          <TextField
            label="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          {initial?.id ? "Guardar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

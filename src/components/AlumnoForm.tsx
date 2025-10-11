// src/components/AlumnoForm.tsx
"use client";
import { useState, useEffect } from "react";
import { Alumno } from "@/types";

export default function AlumnoForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Alumno | null;
  onSubmit: (a: Omit<Alumno, "id"> | Alumno) => void;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [matricula, setMatricula] = useState("");

  useEffect(() => {
    if (initial) {
      setNombre(initial.nombre);
      setMatricula(initial.matricula);
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !matricula.trim()) return;
    onSubmit(
      initial ? { ...initial, nombre, matricula } : { nombre, matricula }
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
      <h3>{initial ? "Editar Alumno" : "Nuevo Alumno"}</h3>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        placeholder="Matrícula"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit">{initial ? "Guardar" : "Crear"}</button>
      </div>
    </form>
  );
}

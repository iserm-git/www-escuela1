import { Calificacion, Evaluacion } from "@/types/gestion-curso";

export const evaluacionesMock: Evaluacion[] = [
  { id: 1, clave: "P1", nombre: "Parcial 1", ponderacion: 30 },
  { id: 2, clave: "P2", nombre: "Parcial 2", ponderacion: 30 },
  { id: 3, clave: "FINAL", nombre: "Examen Final", ponderacion: 40 },
];

export const calificacionesMock: Calificacion[] = [
  {
    id: 1,
    alumno_id: 1,
    alumno_nombre: "Juan Pérez López",
    carga_id: 1,
    grupo_nombre: "1A",
    materia_nombre: "Lenguajes Web",
    evaluacion_id: 1,
    evaluacion_nombre: "Parcial 1",
    calificacion: 8.5,
    capturada_por: 1,
    capturada_en: "2025-10-15T10:30:00Z",
  },
  {
    id: 2,
    alumno_id: 2,
    alumno_nombre: "María García Ruiz",
    carga_id: 1,
    grupo_nombre: "1A",
    materia_nombre: "Lenguajes Web",
    evaluacion_id: 1,
    evaluacion_nombre: "Parcial 1",
    calificacion: 9.0,
    capturada_por: 1,
    capturada_en: "2025-10-15T10:30:00Z",
  },
  {
    id: 3,
    alumno_id: 3,
    alumno_nombre: "Carlos Hernández Silva",
    carga_id: 1,
    grupo_nombre: "1A",
    materia_nombre: "Lenguajes Web",
    evaluacion_id: 1,
    evaluacion_nombre: "Parcial 1",
    calificacion: 5.5,
    capturada_por: 1,
    capturada_en: "2025-10-15T10:30:00Z",
  },
];

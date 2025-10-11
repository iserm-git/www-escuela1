// src/types/index.ts
export type Alumno = {
  id: number;
  nombre: string;
  matricula: string;
  carrera?: string; // si aplica en tu modelo
};

export type Profesor = {
  id: number;
  clave: string;
  nombre: string;
  apellidos: string;
  carrera: string;
};

export type Materia = {
  id: number;
  clave: string;
  nombre: string;
  creditos: number;
  carrera?: string;
};

export type Grupo = {
  id: number;
  clave: string;
  nombre: string;
  carrera: string;
  limite_alumnos: number;
  alumnos_inscritos: number;
};

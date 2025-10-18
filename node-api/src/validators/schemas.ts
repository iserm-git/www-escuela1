import { z } from "zod";

// Alumno
export const createAlumnoSchema = z.object({
  body: z.object({
    matricula: z.string().min(1, "La matrícula es requerida").max(20),
    nombre: z.string().min(1, "El nombre es requerido").max(100),
    apellidoPaterno: z.string().max(100).optional(),
    apellidoMaterno: z.string().max(100).optional(),
    curp: z.string().length(18, "El CURP debe tener 18 caracteres").optional(),
    carreraId: z.number().int().positive().optional(),
    activo: z.boolean().optional().default(true),
  }),
});

export const updateAlumnoSchema = z.object({
  body: z.object({
    matricula: z.string().min(1).max(20).optional(),
    nombre: z.string().min(1).max(100).optional(),
    apellidoPaterno: z.string().max(100).optional(),
    apellidoMaterno: z.string().max(100).optional(),
    curp: z.string().length(18).optional(),
    carreraId: z.number().int().positive().optional(),
    activo: z.boolean().optional(),
  }),
});

// Profesor
export const createProfesorSchema = z.object({
  body: z.object({
    clave: z.string().min(1, "La clave es requerida").max(20),
    nombre: z.string().min(1, "El nombre es requerido").max(100),
    apellidoPaterno: z.string().max(100).optional(),
    apellidoMaterno: z.string().max(100).optional(),
    carreraId: z.number().int().positive().optional(),
    email: z.string().email("Email inválido").max(100).optional(),
    telefono: z.string().max(20).optional(),
    fechaIngreso: z.string().optional(),
    activo: z.boolean().optional().default(true),
  }),
});

export const updateProfesorSchema = z.object({
  body: z.object({
    clave: z.string().min(1).max(20).optional(),
    nombre: z.string().min(1).max(100).optional(),
    apellidoPaterno: z.string().max(100).optional(),
    apellidoMaterno: z.string().max(100).optional(),
    carreraId: z.number().int().positive().optional(),
    email: z.string().email().max(100).optional(),
    telefono: z.string().max(20).optional(),
    fechaIngreso: z.string().optional(),
    activo: z.boolean().optional(),
  }),
});

// Materia
export const createMateriaSchema = z.object({
  body: z.object({
    clave: z.string().min(1, "La clave es requerida").max(20),
    nombre: z.string().min(1, "El nombre es requerido").max(200),
    creditos: z.number().int().min(0).max(32767),
    activo: z.boolean().optional().default(true),
  }),
});

export const updateMateriaSchema = z.object({
  body: z.object({
    clave: z.string().min(1).max(20).optional(),
    nombre: z.string().min(1).max(200).optional(),
    creditos: z.number().int().min(0).max(32767).optional(),
    activo: z.boolean().optional(),
  }),
});

// Grupo
export const createGrupoSchema = z.object({
  body: z.object({
    clave: z.string().min(1, "La clave es requerida").max(20),
    nombre: z.string().min(1, "El nombre es requerido").max(100),
    carreraId: z.number().int().positive("La carrera es requerida"),
    limiteAlumnos: z.number().int().min(1).max(100).optional().default(30),
  }),
});

export const updateGrupoSchema = z.object({
  body: z.object({
    clave: z.string().min(1).max(20).optional(),
    nombre: z.string().min(1).max(100).optional(),
    carreraId: z.number().int().positive().optional(),
    limiteAlumnos: z.number().int().min(1).max(100).optional(),
  }),
});

// Asistencia
export const createAsistenciaSchema = z.object({
  body: z.object({
    alumnoId: z.number().int().positive("El ID del alumno es requerido"),
    grupoId: z.number().int().positive("El ID del grupo es requerido"),
    materiaId: z.number().int().positive("El ID de la materia es requerido"),
    fecha: z.string().datetime("Fecha inválida"),
    estado: z.enum(["presente", "ausente", "retardo", "justificado"]),
    observaciones: z.string().optional(),
  }),
});

export const updateAsistenciaSchema = z.object({
  body: z.object({
    estado: z
      .enum(["presente", "ausente", "retardo", "justificado"])
      .optional(),
    observaciones: z.string().optional(),
  }),
});

// Calificacion
export const createCalificacionSchema = z.object({
  body: z.object({
    alumnoId: z.number().int().positive("El ID del alumno es requerido"),
    grupoId: z.number().int().positive("El ID del grupo es requerido"),
    materiaId: z.number().int().positive("El ID de la materia es requerido"),
    evaluacion: z.string().min(1, "La evaluación es requerida").max(50),
    calificacion: z
      .number()
      .min(0, "La calificación mínima es 0")
      .max(10, "La calificación máxima es 10"),
    capturadaPor: z.number().int().positive().optional(),
  }),
});

export const updateCalificacionSchema = z.object({
  body: z.object({
    calificacion: z.number().min(0).max(10).optional(),
    capturadaPor: z.number().int().positive().optional(),
  }),
});

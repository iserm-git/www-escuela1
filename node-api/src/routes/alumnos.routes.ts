import { Router } from "express";
import {
  getAllAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
} from "../controllers/alumnos.controller";
import { validate } from "../middlewares/validation";
import { createAlumnoSchema, updateAlumnoSchema } from "../validators/schemas";

const router = Router();

/**
 * @route   GET /api/alumnos
 * @desc    Obtener todos los alumnos (con paginación y búsqueda)
 * @access  Public
 */
router.get("/", getAllAlumnos);

/**
 * @route   GET /api/alumnos/:id
 * @desc    Obtener alumno por ID
 * @access  Public
 */
router.get("/:id", getAlumnoById);

/**
 * @route   POST /api/alumnos
 * @desc    Crear nuevo alumno
 * @access  Public
 */
router.post("/", validate(createAlumnoSchema), createAlumno);

/**
 * @route   PUT /api/alumnos/:id
 * @desc    Actualizar alumno
 * @access  Public
 */
router.put("/:id", validate(updateAlumnoSchema), updateAlumno);

/**
 * @route   DELETE /api/alumnos/:id
 * @desc    Eliminar alumno
 * @access  Public
 */
router.delete("/:id", deleteAlumno);

export default router;

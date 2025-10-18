import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

export const getAllAlumnos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          OR: [
            { nombre: { contains: String(search) } },
            { matricula: { contains: String(search) } },
            { apellidoPaterno: { contains: String(search) } },
            { apellidoMaterno: { contains: String(search) } },
          ],
        }
      : {};

    const [alumnos, total] = await Promise.all([
      prisma.alumno.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          carrera: {
            select: { id: true, clave: true, nombre: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.alumno.count({ where }),
    ]);

    res.json({
      success: true,
      data: alumnos,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAlumnoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const alumno = await prisma.alumno.findUnique({
      where: { id: BigInt(id) },
      include: {
        carrera: true,
        inscripciones: {
          include: {
            grupo: {
              include: { carrera: true },
            },
          },
        },
      },
    });

    if (!alumno) {
      return res.status(404).json({
        success: false,
        message: "Alumno no encontrado",
      });
    }

    res.json({
      success: true,
      data: alumno,
    });
  } catch (error) {
    next(error);
  }
};

export const createAlumno = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const alumno = await prisma.alumno.create({
      data: {
        ...data,
        carreraId: data.carreraId ? BigInt(data.carreraId) : undefined,
      },
      include: {
        carrera: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Alumno creado exitosamente",
      data: alumno,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlumno = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const alumno = await prisma.alumno.update({
      where: { id: BigInt(id) },
      data: {
        ...data,
        carreraId: data.carreraId ? BigInt(data.carreraId) : undefined,
      },
      include: {
        carrera: true,
      },
    });

    res.json({
      success: true,
      message: "Alumno actualizado exitosamente",
      data: alumno,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAlumno = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await prisma.alumno.delete({
      where: { id: BigInt(id) },
    });

    res.json({
      success: true,
      message: "Alumno eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

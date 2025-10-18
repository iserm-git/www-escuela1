import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Error de Prisma - registro duplicado
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Ya existe un registro con estos datos únicos",
        error: err.meta,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado",
      });
    }
  }

  // Error genérico
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

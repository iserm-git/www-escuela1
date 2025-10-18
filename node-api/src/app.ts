import express, { Application } from "express";
import corsMiddleware from "./middlewares/cors";
import { errorHandler } from "./middlewares/errorHandler";

// ✨ Declaración de tipo global para BigInt.toJSON
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// ✨ Implementación: Serializar BigInt a string en JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Importar rutas
import alumnosRoutes from "./routes/alumnos.routes";
// import profesoresRoutes from './routes/profesores.routes';
// import materiasRoutes from './routes/materias.routes';

const app: Application = express();

// Middlewares globales
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de Gestión Escolar",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      alumnos: "/api/alumnos",
      profesores: "/api/profesores",
      materias: "/api/materias",
      grupos: "/api/grupos",
      asistencias: "/api/asistencias",
      calificaciones: "/api/calificaciones",
      reportes: "/api/reportes",
    },
    documentation: "Consulta /health para más información",
  });
});

// Rutas de la API
app.use("/api/alumnos", alumnosRoutes);
// app.use('/api/profesores', profesoresRoutes);
// app.use('/api/materias', materiasRoutes);
// app.use('/api/grupos', gruposRoutes);
// app.use('/api/asistencias', asistenciasRoutes);
// app.use('/api/calificaciones', calificacionesRoutes);
// app.use('/api/reportes', reportesRoutes);

// Ruta de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.path,
    method: req.method,
    suggestion: "Verifica la documentación en /health",
  });
});

// Manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;

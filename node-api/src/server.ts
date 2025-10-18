import dotenv from "dotenv";
import app from "./app";
import prisma from "./config/database";

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor Node.js corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API base: http://localhost:${PORT}/api`);
});

// Manejo graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM recibido, cerrando servidor...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Servidor cerrado");
    process.exit(0);
  });
});

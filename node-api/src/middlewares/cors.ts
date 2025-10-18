import cors from "cors";

export const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);

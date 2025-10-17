import axios from "axios";

// Crea una instancia de axios para llamadas a la API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
});

export default api;

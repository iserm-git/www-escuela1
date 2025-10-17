export const validarCalificacion = (valor: number): string | null => {
  if (isNaN(valor)) {
    return "Ingresa un número válido";
  }
  if (valor < 0 || valor > 10) {
    return "La calificación debe estar entre 0 y 10";
  }
  // Máximo 1 decimal
  if ((valor * 10) % 1 !== 0) {
    return "La calificación solo puede tener 1 decimal";
  }
  return null;
};

export const validarFecha = (fecha: string): string | null => {
  const hoy = new Date().toISOString().split("T")[0];
  if (fecha > hoy) {
    return "No puedes registrar asistencia en fechas futuras";
  }
  return null;
};

export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getColorCalificacion = (calificacion: number): string => {
  if (calificacion < 6) return "error.main";
  if (calificacion < 8) return "warning.main";
  return "success.main";
};

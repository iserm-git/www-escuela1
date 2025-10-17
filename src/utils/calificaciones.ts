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

export const getColorCalificacion = (calificacion: number): string => {
  if (calificacion < 6) return "error.main";
  if (calificacion < 8) return "warning.main";
  return "success.main";
};

export const getEstatusCalificacion = (calificacion: number): string => {
  if (calificacion >= 6) return "Aprobado";
  return "Reprobado";
};

export const calcularPromedio = (calificaciones: number[]): number => {
  if (calificaciones.length === 0) return 0;
  const suma = calificaciones.reduce((acc, cal) => acc + cal, 0);
  return Number((suma / calificaciones.length).toFixed(2));
};

export const formatearCalificacion = (calificacion: number): string => {
  return calificacion.toFixed(1);
};

export const getLetraCalificacion = (calificacion: number): string => {
  if (calificacion >= 9) return "A";
  if (calificacion >= 8) return "B";
  if (calificacion >= 7) return "C";
  if (calificacion >= 6) return "D";
  return "F";
};

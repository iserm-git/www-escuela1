# Módulo de Reportes - Estructura de Archivos e Indicaciones

## 📁 Estructura de Archivos

```
app/
├── reportes/
│   ├── page.tsx                          # Página principal - selector de reportes
│   ├── asistencias/
│   │   ├── page.tsx                      # Vista principal de asistencias
│   │   ├── grupo/[id]/page.tsx           # Reporte de asistencias por grupo
│   │   └── alumno/[id]/page.tsx          # Reporte de asistencias por alumno
│   ├── grupos/
│   │   ├── page.tsx                      # Estadísticas generales de grupos
│   │   └── [id]/page.tsx                 # Detalle de grupo específico
│   ├── profesores/
│   │   ├── page.tsx                      # Estadísticas de profesores
│   │   └── [id]/page.tsx                 # Rendimiento por profesor
│   └── alumnos/
│       ├── page.tsx                      # Búsqueda de alumnos
│       └── [id]/page.tsx                 # Historial académico individual

src/
├── components/
│   └── reportes/
│       ├── ReportSelector.tsx            # Selector de tipo de reporte
│       ├── FiltrosReporte.tsx            # Filtros comunes (fecha, periodo)
│       ├── AsistenciaChart.tsx           # Gráfico de asistencias
│       ├── PromediosChart.tsx            # Gráfico de promedios
│       ├── RendimientoChart.tsx          # Gráfico de rendimiento
│       ├── HistorialAcademico.tsx        # Tabla historial académico
│       ├── TablaAsistencias.tsx          # Tabla de asistencias
│       ├── EstadisticasCard.tsx          # Tarjeta de estadística individual
│       ├── ExportButton.tsx              # Botón exportar PDF/Excel
│       └── DateRangePicker.tsx           # Selector de rango de fechas
│
├── services/
│   └── reportes.service.ts               # Servicios API para reportes
│
├── types/
│   └── reportes.types.ts                 # Tipos TypeScript para reportes
│
└── utils/
    ├── reportes.utils.ts                 # Utilidades para cálculos
    └── exportReportes.ts                 # Lógica de exportación
```

---

## 📋 Descripción de Archivos Principales

### 1. **app/reportes/page.tsx**
**Propósito:** Página principal del módulo de reportes con selector de tipo de reporte.

**Contenido:**
- Grid con tarjetas para cada tipo de reporte
- Íconos descriptivos (Asistencias, Grupos, Profesores, Alumnos)
- Navegación a cada sección de reportes
- Resumen rápido de estadísticas generales

**Componentes a usar:**
- `<ReportSelector />` - Tarjetas de selección
- `<Container>`, `<Grid>`, `<Card>` de Material-UI

---

### 2. **app/reportes/asistencias/page.tsx**
**Propósito:** Vista principal de reportes de asistencia con opciones de filtrado.

**Funcionalidades:**
- Selector: "Por Grupo" o "Por Alumno"
- Filtros: Periodo lectivo, rango de fechas
- Lista de grupos o alumnos para seleccionar
- Vista previa de estadísticas generales

**Componentes:**
- `<FiltrosReporte />` - Filtros de periodo y fechas
- `<TablaAsistencias />` - Lista de grupos/alumnos
- `<AsistenciaChart />` - Gráfico resumen

---

### 3. **app/reportes/asistencias/grupo/[id]/page.tsx**
**Propósito:** Reporte detallado de asistencias de un grupo específico.

**Datos a mostrar:**
- Información del grupo (nombre, materia, profesor)
- Tabla de asistencias con fechas y alumnos
- Resumen: total presentes, ausentes, retardos, justificados
- Gráfico de tendencia de asistencias
- Porcentaje de asistencia por alumno
- Opción de exportar a PDF/Excel

**Componentes:**
- `<TablaAsistencias />` con datos del grupo
- `<AsistenciaChart />` con gráfico de barras/líneas
- `<EstadisticasCard />` para métricas clave
- `<ExportButton />` para exportar

---

### 4. **app/reportes/asistencias/alumno/[id]/page.tsx**
**Propósito:** Reporte de asistencias de un alumno individual.

**Datos a mostrar:**
- Información del alumno (matrícula, nombre, carrera)
- Historial de asistencias por materia/grupo
- Porcentaje de asistencia general y por materia
- Calendario visual de asistencias
- Gráfico de tendencia mensual

---

### 5. **app/reportes/grupos/page.tsx**
**Propósito:** Estadísticas generales de todos los grupos.

**Datos a mostrar:**
- Lista de grupos del periodo actual
- Promedio general por grupo
- Tasa de aprobación por grupo
- Comparativa entre grupos
- Materias con mejor/peor desempeño
- Gráfico de promedios generales

**Componentes:**
- `<PromediosChart />` - Gráfico de barras comparativo
- `<EstadisticasCard />` - Métricas por grupo
- Tabla con datos de cada grupo

---

### 6. **app/reportes/profesores/page.tsx**
**Propósito:** Estadísticas de rendimiento de profesores.

**Datos a mostrar:**
- Lista de profesores activos
- Grupos asignados por profesor
- Promedio de calificaciones de sus grupos
- Tasa de aprobación por profesor
- Comparativa de rendimiento

**Componentes:**
- `<RendimientoChart />` - Gráfico comparativo
- Tabla de profesores con métricas
- Filtros por carrera y periodo

---

### 7. **app/reportes/profesores/[id]/page.tsx**
**Propósito:** Detalle de rendimiento por profesor individual.

**Datos a mostrar:**
- Información del profesor (clave, nombre, carrera)
- Grupos que imparte en el periodo
- Promedio por grupo y materia
- Distribución de calificaciones (A, B, C, D, F)
- Comparativa con promedio institucional
- Historial de periodos anteriores

---

### 8. **app/reportes/alumnos/[id]/page.tsx**
**Propósito:** Historial académico completo de un alumno.

**Datos a mostrar:**
- Información del alumno (matrícula, carrera, semestre)
- Tabla de calificaciones por periodo
- Promedio general acumulado
- Promedio por semestre
- Materias aprobadas/reprobadas
- Gráfico de tendencia académica
- Créditos acumulados
- Asistencias generales por periodo

**Componentes:**
- `<HistorialAcademico />` - Tabla de calificaciones
- `<PromediosChart />` - Gráfico de tendencia
- `<EstadisticasCard />` - Métricas académicas
- `<ExportButton />` - Exportar historial

---

## 🔧 Archivos de Soporte

### **src/types/reportes.types.ts**
```typescript
export interface ReporteAsistencia {
  alumnoId: number;
  alumnoNombre: string;
  grupoId: number;
  grupoNombre: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'retardo' | 'justificado';
  observaciones?: string;
}

export interface EstadisticasAsistencia {
  totalClases: number;
  presentes: number;
  ausentes: number;
  retardos: number;
  justificados: number;
  porcentajeAsistencia: number;
}

export interface EstadisticasGrupo {
  grupoId: number;
  grupoNombre: string;
  materiaId: number;
  materiaNombre: string;
  promedioGeneral: number;
  totalAlumnos: number;
  aprobados: number;
  reprobados: number;
  tasaAprobacion: number;
}

export interface RendimientoProfesor {
  profesorId: number;
  profesorNombre: string;
  grupos: EstadisticasGrupo[];
  promedioGlobal: number;
  totalGrupos: number;
  tasaAprobacionPromedio: number;
}

export interface HistorialAcademico {
  periodoId: number;
  periodoClave: string;
  materias: CalificacionPeriodo[];
  promedioSemestre: number;
  creditosObtenidos: number;
}

export interface CalificacionPeriodo {
  materiaId: number;
  materiaNombre: string;
  calificacion: number;
  creditos: number;
  profesorNombre: string;
  estado: 'aprobada' | 'reprobada' | 'cursando';
}

export interface FiltrosReporte {
  periodoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  grupoId?: number;
  materiaId?: number;
  carreraId?: number;
}
```

---

### **src/services/reportes.service.ts**
```typescript
import api from './api';
import type {
  ReporteAsistencia,
  EstadisticasAsistencia,
  EstadisticasGrupo,
  RendimientoProfesor,
  HistorialAcademico,
  FiltrosReporte
} from '@/types/reportes.types';

export const reportesService = {
  // Asistencias
  async getAsistenciasPorGrupo(grupoId: number, filtros?: FiltrosReporte): Promise<ReporteAsistencia[]> {
    const { data } = await api.get(`/reportes/asistencias/grupo/${grupoId}`, { params: filtros });
    return data;
  },

  async getAsistenciasPorAlumno(alumnoId: number, filtros?: FiltrosReporte): Promise<ReporteAsistencia[]> {
    const { data } = await api.get(`/reportes/asistencias/alumno/${alumnoId}`, { params: filtros });
    return data;
  },

  async getEstadisticasAsistencia(id: number, tipo: 'grupo' | 'alumno'): Promise<EstadisticasAsistencia> {
    const { data } = await api.get(`/reportes/asistencias/estadisticas/${tipo}/${id}`);
    return data;
  },

  // Grupos
  async getEstadisticasGrupos(filtros?: FiltrosReporte): Promise<EstadisticasGrupo[]> {
    const { data } = await api.get('/reportes/grupos', { params: filtros });
    return data;
  },

  async getEstadisticasGrupo(grupoId: number): Promise<EstadisticasGrupo> {
    const { data } = await api.get(`/reportes/grupos/${grupoId}`);
    return data;
  },

  // Profesores
  async getRendimientoProfesores(filtros?: FiltrosReporte): Promise<RendimientoProfesor[]> {
    const { data } = await api.get('/reportes/profesores', { params: filtros });
    return data;
  },

  async getRendimientoProfesor(profesorId: number, filtros?: FiltrosReporte): Promise<RendimientoProfesor> {
    const { data } = await api.get(`/reportes/profesores/${profesorId}`, { params: filtros });
    return data;
  },

  // Alumnos
  async getHistorialAcademico(alumnoId: number): Promise<HistorialAcademico[]> {
    const { data } = await api.get(`/reportes/alumnos/${alumnoId}/historial`);
    return data;
  },

  // Exportación
  async exportarPDF(tipo: string, id: number, filtros?: FiltrosReporte): Promise<Blob> {
    const { data } = await api.get(`/reportes/exportar/pdf/${tipo}/${id}`, {
      params: filtros,
      responseType: 'blob'
    });
    return data;
  },

  async exportarExcel(tipo: string, id: number, filtros?: FiltrosReporte): Promise<Blob> {
    const { data } = await api.get(`/reportes/exportar/excel/${tipo}/${id}`, {
      params: filtros,
      responseType: 'blob'
    });
    return data;
  }
};
```

---

### **src/utils/reportes.utils.ts**
```typescript
import type { ReporteAsistencia, EstadisticasAsistencia, HistorialAcademico } from '@/types/reportes.types';

export function calcularEstadisticasAsistencia(asistencias: ReporteAsistencia[]): EstadisticasAsistencia {
  const totalClases = asistencias.length;
  const presentes = asistencias.filter(a => a.estado === 'presente').length;
  const ausentes = asistencias.filter(a => a.estado === 'ausente').length;
  const retardos = asistencias.filter(a => a.estado === 'retardo').length;
  const justificados = asistencias.filter(a => a.estado === 'justificado').length;
  
  const porcentajeAsistencia = totalClases > 0 
    ? Math.round((presentes / totalClases) * 100) 
    : 0;

  return {
    totalClases,
    presentes,
    ausentes,
    retardos,
    justificados,
    porcentajeAsistencia
  };
}

export function calcularPromedioGeneral(historial: HistorialAcademico[]): number {
  let sumaCalificaciones = 0;
  let totalMaterias = 0;

  historial.forEach(periodo => {
    periodo.materias.forEach(materia => {
      if (materia.estado !== 'cursando') {
        sumaCalificaciones += materia.calificacion;
        totalMaterias++;
      }
    });
  });

  return totalMaterias > 0 ? Math.round((sumaCalificaciones / totalMaterias) * 100) / 100 : 0;
}

export function calcularCreditosAcumulados(historial: HistorialAcademico[]): number {
  return historial.reduce((total, periodo) => {
    const creditosPeriodo = periodo.materias
      .filter(m => m.estado === 'aprobada')
      .reduce((sum, m) => sum + m.creditos, 0);
    return total + creditosPeriodo;
  }, 0);
}

export function obtenerTendenciaAsistencia(asistencias: ReporteAsistencia[]): 'up' | 'down' | 'flat' {
  if (asistencias.length < 2) return 'flat';
  
  const mitad = Math.floor(asistencias.length / 2);
  const primerasMitad = asistencias.slice(0, mitad);
  const segundaMitad = asistencias.slice(mitad);
  
  const porcentajePrimera = calcularPorcentaje(primerasMitad);
  const porcentajeSegunda = calcularPorcentaje(segundaMitad);
  
  const diferencia = porcentajeSegunda - porcentajePrimera;
  
  if (diferencia > 5) return 'up';
  if (diferencia < -5) return 'down';
  return 'flat';
}

function calcularPorcentaje(asistencias: ReporteAsistencia[]): number {
  const presentes = asistencias.filter(a => a.estado === 'presente').length;
  return asistencias.length > 0 ? (presentes / asistencias.length) * 100 : 0;
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function obtenerColorCalificacion(calificacion: number): string {
  if (calificacion >= 9) return 'success';
  if (calificacion >= 7) return 'info';
  if (calificacion >= 6) return 'warning';
  return 'error';
}
```

---

## 📊 Indicaciones de Implementación

### 1. **Componentes de Visualización**

#### AsistenciaChart.tsx
- Usar `@mui/x-charts` (LineChart o BarChart)
- Mostrar tendencia de asistencias en el tiempo
- Colores: verde (presente), rojo (ausente), amarillo (retardo), azul (justificado)
- Tooltip con información detallada

#### PromediosChart.tsx
- Gráfico de barras comparativo entre grupos/periodos
- Línea horizontal con promedio general
- Colores según rango de calificación

#### HistorialAcademico.tsx
- Tabla Material-UI con DataGrid
- Columnas: Materia, Calificación, Créditos, Profesor, Estado
- Filtros por periodo
- Footer con promedio y créditos totales

---

### 2. **Filtros y Búsqueda**

#### FiltrosReporte.tsx
- Select para periodo lectivo
- DateRangePicker para rango de fechas
- Select múltiple para materias/grupos
- Botón "Aplicar filtros" y "Limpiar"
- Estado de filtros en query params de la URL

---

### 3. **Exportación de Reportes**

#### ExportButton.tsx
- Botones para PDF y Excel
- Descarga automática del archivo
- Loading state durante generación
- Nombre del archivo con fecha y tipo de reporte

**Backend necesario:**
- Endpoints `/api/reportes/exportar/pdf/:tipo/:id`
- Endpoints `/api/reportes/exportar/excel/:tipo/:id`
- Librerías sugeridas: `jsPDF`, `xlsx`, `pdfmake`

---

### 4. **Protección de Rutas**

Todas las páginas de reportes deben usar el componente `<Protected>`:

```tsx
import Protected from '@/components/Protected';

export default function ReportePage() {
  return (
    <Protected>
      {/* Contenido del reporte */}
    </Protected>
  );
}
```

---

### 5. **Estados de Carga y Errores**

- Loading: Skeleton o Spinner de Material-UI
- Error: Alert con mensaje descriptivo
- Sin datos: EmptyState con ilustración
- Usar `react-query` o `SWR` para cache de datos

---

### 6. **Responsive Design**

- Grid adaptable en móviles: 1 columna
- Gráficos escalables con height/width responsivos
- Tablas con scroll horizontal en móviles
- Botones de exportación en menú hamburguesa en móvil

---

### 7. **Permisos de Acceso**

| Tipo de Usuario | Reportes Permitidos |
|-----------------|---------------------|
| **Administrador** | Todos los reportes |
| **Profesor** | Sus grupos y materias asignadas |
| **Alumno** | Solo su historial académico y asistencias |

Implementar validación en backend y frontend.

---

## 🚀 Orden de Implementación Sugerido

1. **Tipos TypeScript** (`reportes.types.ts`)
2. **Servicios API** (`reportes.service.ts`)
3. **Utilidades** (`reportes.utils.ts`)
4. **Componentes base** (FiltrosReporte, EstadisticasCard)
5. **Página principal** (`app/reportes/page.tsx`)
6. **Reportes de asistencias** (por grupo y alumno)
7. **Estadísticas de grupos**
8. **Estadísticas de profesores**
9. **Historial académico de alumnos**
10. **Componentes de gráficos**
11. **Funcionalidad de exportación**

---

## 📝 Notas Adicionales

- **Caché de datos:** Implementar cache para reportes pesados
- **Paginación:** Para listas largas de alumnos/grupos
- **Actualización en tiempo real:** Considerar WebSockets para asistencias del día
- **Accesibilidad:** Etiquetas ARIA, contraste de colores, navegación por teclado
- **Internacionalización:** Preparar textos para i18n si es necesario
- **Testing:** Unit tests para funciones de cálculo, integration tests para componentes

---

## 🔗 Integraciones con Otros Módulos

- **Módulo de Grupos:** Selector de grupos activos
- **Módulo de Alumnos:** Búsqueda y selección de alumnos
- **Módulo de Profesores:** Datos de profesores asignados
- **Módulo de Gestión de Curso:** Datos de asistencias y calificaciones
- **Módulo de Periodos:** Filtrado por periodo lectivo

---

**¡Estructura lista para implementación! 🎉**
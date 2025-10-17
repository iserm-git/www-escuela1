# Estructura del Módulo de Gestión de Curso

## 📁 Estructura de Archivos

```
app/
├── gestion-curso/
│   ├── layout.tsx                    # Layout común para el módulo
│   ├── page.tsx                      # Dashboard del módulo (opcional)
│   │
│   ├── asistencia/
│   │   ├── page.tsx                  # Página principal - Lista de asistencias
│   │   ├── registrar/
│   │   │   └── page.tsx              # Formulario de registro masivo
│   │   └── [id]/
│   │       └── page.tsx              # Ver/editar asistencia específica
│   │
│   └── calificaciones/
│       ├── page.tsx                  # Página principal - Lista de calificaciones
│       ├── registrar/
│       │   └── page.tsx              # Formulario de captura por grupo
│       └── [id]/
│           └── page.tsx              # Ver/editar calificación específica

src/
├── components/
│   ├── gestion-curso/
│   │   ├── AsistenciaDialog.tsx      # Modal para registrar/editar asistencia
│   │   ├── AsistenciaTable.tsx       # Tabla de asistencias con acciones
│   │   ├── AsistenciaFilters.tsx     # Filtros (fecha, grupo, materia)
│   │   ├── AsistenciaRegistroMasivo.tsx  # Componente para registro diario
│   │   │
│   │   ├── CalificacionDialog.tsx    # Modal para registrar/editar calificación
│   │   ├── CalificacionTable.tsx     # Tabla de calificaciones
│   │   ├── CalificacionFilters.tsx   # Filtros (grupo, materia, evaluación)
│   │   └── CalificacionCapturaMasiva.tsx # Captura de notas por grupo
│   │
│   └── shared/
│       ├── ConfirmDialog.tsx         # Diálogo de confirmación para borrado
│       └── DatePicker.tsx            # Selector de fecha personalizado
│
├── services/
│   ├── asistenciaService.ts          # API calls para asistencias
│   └── calificacionService.ts        # API calls para calificaciones
│
├── types/
│   └── gestion-curso.ts              # Tipos TypeScript del módulo
│
└── hooks/
    ├── useAsistencia.ts              # Hook personalizado para asistencias
    └── useCalificacion.ts            # Hook personalizado para calificaciones
```

---

## 📋 Tipos TypeScript (src/types/gestion-curso.ts)

```typescript
// ============================================
// TIPOS PARA ASISTENCIA
// ============================================

export type EstadoAsistencia = 
  | "presente" 
  | "ausente" 
  | "retardo" 
  | "justificado";

export interface Asistencia {
  id: number;
  alumno_id: number;
  alumno_nombre?: string;
  carga_id: number;
  grupo_nombre?: string;
  materia_nombre?: string;
  profesor_nombre?: string;
  fecha: string; // formato ISO: "YYYY-MM-DD"
  estado: EstadoAsistencia;
  observaciones?: string;
}

export interface AsistenciaRegistro {
  alumno_id: number;
  carga_id: number;
  fecha: string;
  estado: EstadoAsistencia;
  observaciones?: string;
}

export interface AsistenciaFiltros {
  grupo_id?: number;
  materia_id?: number;
  profesor_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: EstadoAsistencia;
}

// ============================================
// TIPOS PARA CALIFICACIONES
// ============================================

export interface Calificacion {
  id: number;
  alumno_id: number;
  alumno_nombre?: string;
  carga_id: number;
  grupo_nombre?: string;
  materia_nombre?: string;
  evaluacion_id: number;
  evaluacion_nombre?: string;
  calificacion: number; // 0-10
  capturada_por?: number;
  capturada_en?: string;
}

export interface CalificacionRegistro {
  alumno_id: number;
  carga_id: number;
  evaluacion_id: number;
  calificacion: number;
}

export interface CalificacionFiltros {
  grupo_id?: number;
  materia_id?: number;
  evaluacion_id?: number;
  alumno_id?: number;
}

export interface Evaluacion {
  id: number;
  clave: string;
  nombre: string;
  ponderacion: number; // porcentaje
}
```

---

## 🔧 Servicios API (src/services/asistenciaService.ts)

```typescript
import api from "./api";
import { 
  Asistencia, 
  AsistenciaRegistro, 
  AsistenciaFiltros 
} from "@/types/gestion-curso";

const BASE_URL = "/asistencias";

export const asistenciaService = {
  // Obtener asistencias con filtros
  async getAll(filtros?: AsistenciaFiltros): Promise<Asistencia[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  // Obtener asistencia por ID
  async getById(id: number): Promise<Asistencia> {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Registrar asistencia individual
  async create(data: AsistenciaRegistro): Promise<Asistencia> {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Registrar asistencias masivas (grupo completo)
  async createBulk(asistencias: AsistenciaRegistro[]): Promise<Asistencia[]> {
    const response = await api.post(`${BASE_URL}/bulk`, asistencias);
    return response.data;
  },

  // Actualizar asistencia
  async update(id: number, data: Partial<AsistenciaRegistro>): Promise<Asistencia> {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar asistencia
  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Obtener resumen de asistencias por alumno
  async getResumenAlumno(alumnoId: number, periodoId?: number) {
    const params = periodoId ? `?periodo_id=${periodoId}` : "";
    const response = await api.get(`${BASE_URL}/resumen/alumno/${alumnoId}${params}`);
    return response.data;
  },
};
```

---

## 🔧 Servicios API (src/services/calificacionService.ts)

```typescript
import api from "./api";
import { 
  Calificacion, 
  CalificacionRegistro, 
  CalificacionFiltros,
  Evaluacion 
} from "@/types/gestion-curso";

const BASE_URL = "/calificaciones";

export const calificacionService = {
  // Obtener calificaciones con filtros
  async getAll(filtros?: CalificacionFiltros): Promise<Calificacion[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  // Obtener calificación por ID
  async getById(id: number): Promise<Calificacion> {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Registrar calificación individual
  async create(data: CalificacionRegistro): Promise<Calificacion> {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Registrar calificaciones masivas (grupo + evaluación)
  async createBulk(calificaciones: CalificacionRegistro[]): Promise<Calificacion[]> {
    const response = await api.post(`${BASE_URL}/bulk`, calificaciones);
    return response.data;
  },

  // Actualizar calificación
  async update(id: number, data: Partial<CalificacionRegistro>): Promise<Calificacion> {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar calificación
  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Obtener kardex de alumno
  async getKardexAlumno(alumnoId: number) {
    const response = await api.get(`${BASE_URL}/kardex/${alumnoId}`);
    return response.data;
  },

  // Obtener evaluaciones disponibles
  async getEvaluaciones(): Promise<Evaluacion[]> {
    const response = await api.get("/evaluaciones");
    return response.data;
  },
};
```

---

## 🎯 Indicaciones de Implementación

### **1. SUBMÓDULO DE ASISTENCIA**

#### Funcionalidades principales:

**a) Registrar Asistencia (Masivo)**
- Página: `app/gestion-curso/asistencia/registrar/page.tsx`
- Componente: `AsistenciaRegistroMasivo.tsx`
- Flujo:
  1. Profesor selecciona grupo + materia + fecha
  2. Sistema carga lista completa de alumnos inscritos
  3. Interfaz tipo checklist con botones rápidos (Presente/Ausente/Retardo/Justificado)
  4. Guardado masivo con `createBulk()`

**b) Mostrar Asistencias**
- Página: `app/gestion-curso/asistencia/page.tsx`
- Componente: `AsistenciaTable.tsx`
- Características:
  - Tabla con columnas: Alumno, Grupo, Materia, Fecha, Estado, Acciones
  - Filtros: Fecha rango, Grupo, Materia, Estado
  - Paginación server-side
  - Indicadores visuales por estado (chips de colores)

**c) Editar Asistencia**
- Modal: `AsistenciaDialog.tsx`
- Permite cambiar estado y observaciones
- Validación: No permitir fechas futuras

**d) Borrar Asistencia**
- Confirmación con `ConfirmDialog.tsx`
- Registro en auditoría

---

### **2. SUBMÓDULO DE CALIFICACIONES**

#### Funcionalidades principales:

**a) Registrar Calificaciones (Por Grupo)**
- Página: `app/gestion-curso/calificaciones/registrar/page.tsx`
- Componente: `CalificacionCapturaMasiva.tsx`
- Flujo:
  1. Profesor selecciona grupo + materia + evaluación (Parcial 1, 2, Final, etc.)
  2. Sistema carga alumnos del grupo con calificaciones previas
  3. Inputs numéricos (0-10) con validación
  4. Guardado masivo

**b) Mostrar Calificaciones**
- Página: `app/gestion-curso/calificaciones/page.tsx`
- Componente: `CalificacionTable.tsx`
- Características:
  - Vista por grupo o por alumno
  - Filtros: Grupo, Materia, Evaluación
  - Exportar a Excel/PDF
  - Colores según rango (Rojo <6, Amarillo 6-7.9, Verde ≥8)

**c) Editar Calificación**
- Modal: `CalificacionDialog.tsx`
- Validación: 0-10 con máximo 1 decimal
- Registro de quién capturó/modificó

**d) Borrar Calificación**
- Solo administradores y profesor que capturó
- Confirmación con razón obligatoria
- Auditoría completa

---

## 🔐 Consideraciones de Seguridad

```typescript
// Middleware de permisos (ejemplo)
// src/middleware/permisos.ts

export const verificarPermisoAsistencia = (accion: "create" | "read" | "update" | "delete") => {
  // Verificar:
  // 1. Usuario autenticado
  // 2. Rol profesor puede registrar/editar solo sus grupos
  // 3. Admin puede todo
  // 4. Alumno solo puede ver sus propias asistencias
};

export const verificarPermisoCalificacion = (accion: "create" | "read" | "update" | "delete") => {
  // Similar a asistencia
  // Extra: Solo profesor que imparte la materia puede capturar
};
```

---

## 📊 Validaciones Frontend

### Asistencia:
- ✅ Fecha no puede ser futura
- ✅ No duplicar asistencia (alumno + carga + fecha)
- ✅ Estado requerido
- ✅ Observaciones máximo 500 caracteres

### Calificaciones:
- ✅ Valor entre 0 y 10
- ✅ Máximo 1 decimal (8.5 válido, 8.55 inválido)
- ✅ No duplicar (alumno + carga + evaluación)
- ✅ Evaluación debe existir y estar activa

---

## 🎨 Componentes MUI Recomendados

```typescript
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton, Tooltip, TextField,
  Select, MenuItem, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, CircularProgress,
  Autocomplete, DatePicker
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as PresenteIcon,
  Cancel as AusenteIcon,
  Schedule as RetardoIcon,
  Assignment as JustificadoIcon
} from "@mui/icons-material";
```

---

## 🚀 Pasos de Implementación

### **Fase 1: Setup**
1. Crear estructura de carpetas
2. Definir tipos TypeScript
3. Crear servicios API
4. Configurar rutas en navegación

### **Fase 2: Asistencia**
1. Implementar `AsistenciaTable` (Mostrar)
2. Implementar `AsistenciaDialog` (Editar)
3. Implementar `AsistenciaRegistroMasivo` (Registrar)
4. Implementar borrado con confirmación
5. Agregar filtros y búsqueda
6. Testing

### **Fase 3: Calificaciones**
1. Implementar `CalificacionTable` (Mostrar)
2. Implementar `CalificacionDialog` (Editar)
3. Implementar `CalificacionCapturaMasiva` (Registrar)
4. Implementar borrado con auditoría
5. Agregar cálculo de promedios
6. Testing

### **Fase 4: Integración**
1. Conectar con módulo de Reportes
2. Agregar notificaciones
3. Optimizar rendimiento
4. Documentación
5. Deploy

---

## 📝 Notas Importantes

- **Carga Académica**: El campo `carga_id` vincula grupo + materia + profesor
- **Auditoría**: Todas las operaciones deben registrarse en `bitacora_auditoria`
- **Permisos**: Usar `roles_permisos` para control de acceso granular
- **Periodo Lectivo**: Considerar periodo activo para filtros por defecto
- **Responsividad**: Usar Grid/Stack de MUI para layouts adaptativos
- **Performance**: Implementar paginación server-side para tablas grandes
- **UX**: Feedback visual inmediato (Snackbar) en todas las operaciones CRUD

---

## 🔗 Navegación Sugerida

```typescript
// src/config/navigation.ts (agregar)
{
  title: "Gestión de Curso",
  icon: <SchoolIcon />,
  children: [
    { title: "Asistencia", path: "/gestion-curso/asistencia", icon: <EventAvailableIcon /> },
    { title: "Calificaciones", path: "/gestion-curso/calificaciones", icon: <GradeIcon /> },
  ]
}
```
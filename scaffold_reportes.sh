#!/bin/bash
# scaffold-reportes.sh
# ==========================================
# Crea estructura completa del módulo de reportes
# para el proyecto Next.js (App Router)
# ==========================================

set -euo pipefail

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  GENERADOR DE MÓDULO REPORTES${NC}"
echo -e "${BLUE}================================${NC}\n"

# Función para crear archivos
mkfile() {
  local f="$1"
  local desc="$2"
  
  # Crear directorio si no existe
  mkdir -p "$(dirname "$f")"
  
  # Crear archivo solo si no existe
  if [ ! -f "$f" ]; then
    touch "$f"
    echo -e "${GREEN}✓${NC} Creado: ${desc}"
  else
    echo -e "${YELLOW}⚠${NC} Ya existe: ${desc}"
  fi
}

echo -e "${BLUE}[1/5]${NC} Creando páginas del módulo reportes..."
echo "----------------------------------------"

# Página principal de reportes
mkfile "app/reportes/page.tsx" "Página principal de reportes"

# Reportes de Asistencias
mkfile "app/reportes/asistencias/page.tsx" "Vista principal de asistencias"
mkfile "app/reportes/asistencias/grupo/[id]/page.tsx" "Asistencias por grupo"
mkfile "app/reportes/asistencias/alumno/[id]/page.tsx" "Asistencias por alumno"

# Reportes de Grupos
mkfile "app/reportes/grupos/page.tsx" "Estadísticas generales de grupos"
mkfile "app/reportes/grupos/[id]/page.tsx" "Detalle de grupo específico"

# Reportes de Profesores
mkfile "app/reportes/profesores/page.tsx" "Estadísticas de profesores"
mkfile "app/reportes/profesores/[id]/page.tsx" "Rendimiento por profesor"

# Reportes de Alumnos
mkfile "app/reportes/alumnos/page.tsx" "Búsqueda de alumnos"
mkfile "app/reportes/alumnos/[id]/page.tsx" "Historial académico individual"

echo ""
echo -e "${BLUE}[2/5]${NC} Creando componentes de reportes..."
echo "----------------------------------------"

# Componentes principales
mkfile "src/components/reportes/ReportSelector.tsx" "Selector de tipo de reporte"
mkfile "src/components/reportes/FiltrosReporte.tsx" "Filtros comunes (fecha, periodo)"
mkfile "src/components/reportes/DateRangePicker.tsx" "Selector de rango de fechas"
mkfile "src/components/reportes/ExportButton.tsx" "Botón exportar PDF/Excel"

# Componentes de visualización
mkfile "src/components/reportes/AsistenciaChart.tsx" "Gráfico de asistencias"
mkfile "src/components/reportes/PromediosChart.tsx" "Gráfico de promedios"
mkfile "src/components/reportes/RendimientoChart.tsx" "Gráfico de rendimiento"

# Componentes de tablas
mkfile "src/components/reportes/TablaAsistencias.tsx" "Tabla de asistencias"
mkfile "src/components/reportes/HistorialAcademico.tsx" "Tabla historial académico"

# Componentes de estadísticas
mkfile "src/components/reportes/EstadisticasCard.tsx" "Tarjeta de estadística individual"

echo ""
echo -e "${BLUE}[3/5]${NC} Creando servicios y tipos..."
echo "----------------------------------------"

# Servicios
mkfile "src/services/reportes.service.ts" "Servicios API para reportes"

# Tipos TypeScript
mkfile "src/types/reportes.types.ts" "Tipos TypeScript para reportes"

echo ""
echo -e "${BLUE}[4/5]${NC} Creando utilidades..."
echo "----------------------------------------"

# Utilidades
mkfile "src/utils/reportes.utils.ts" "Utilidades para cálculos"
mkfile "src/utils/exportReportes.ts" "Lógica de exportación"

echo ""
echo -e "${BLUE}[5/5]${NC} Creando archivos de documentación..."
echo "----------------------------------------"

# Documentación
mkfile "docs/REPORTES.md" "Documentación del módulo de reportes"
mkfile "docs/API_REPORTES.md" "Documentación de API de reportes"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  ✓ ESTRUCTURA CREADA${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Archivos creados para el módulo de ${YELLOW}Reportes${NC}:"
echo ""
echo "📁 Páginas (App Router):"
echo "   • app/reportes/"
echo "     ├── page.tsx (principal)"
echo "     ├── asistencias/"
echo "     ├── grupos/"
echo "     ├── profesores/"
echo "     └── alumnos/"
echo ""
echo "🎨 Componentes:"
echo "   • src/components/reportes/ (10 componentes)"
echo ""
echo "⚙️  Servicios y Tipos:"
echo "   • src/services/reportes.service.ts"
echo "   • src/types/reportes.types.ts"
echo ""
echo "🔧 Utilidades:"
echo "   • src/utils/reportes.utils.ts"
echo "   • src/utils/exportReportes.ts"
echo ""
echo "📚 Documentación:"
echo "   • docs/REPORTES.md"
echo "   • docs/API_REPORTES.md"
echo ""
echo -e "${BLUE}Siguiente paso:${NC}"
echo "1. Revisar la estructura de archivos creada"
echo "2. Implementar cada componente según las indicaciones"
echo "3. Configurar las rutas API en el backend"
echo ""
echo -e "${GREEN}¡Listo para comenzar a desarrollar! 🚀${NC}"
echo ""
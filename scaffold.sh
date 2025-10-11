# scaffold.sh
# ==========================================
# Crea estructura de carpetas y archivos vacíos
# para el proyecto Next.js (App Router)
# ==========================================

set -euo pipefail

mkfile() {
  local f="$1"
  mkdir -p "$(dirname "$f")"
  # crea el archivo solo si no existe, vacío
  : > "$f"
}

# --- app/ (rutas) ---
mkfile "app/layout.tsx"
mkfile "app/page.tsx"

mkfile "app/login/page.tsx"
mkfile "app/home/page.tsx"

mkfile "app/alumnos/page.tsx"
mkfile "app/alumnos/[id]/page.tsx"

mkfile "app/profesores/page.tsx"

mkfile "app/registrar/page.tsx"
mkfile "app/recuperar/page.tsx"

# --- src/components ---
mkfile "src/components/Navbar.tsx"
mkfile "src/components/Footer.tsx"
mkfile "src/components/StatCard.tsx"
mkfile "src/components/Table.tsx"
mkfile "src/components/Modal.tsx"

# --- src/context ---
mkfile "src/context/AuthContext.tsx"

# --- src/hooks ---
mkfile "src/hooks/useForm.ts"

# --- src/services ---
mkfile "src/services/api.ts"

# --- src/config ---
mkfile "src/config/navigation.ts"

# --- src/types ---
mkfile "src/types/index.ts"

# --- src/utils ---
mkfile "src/utils/validations.ts"

# --- src/styles ---
mkfile "src/styles/globals.css"

# --- raíz ---
mkfile ".env.local"
mkfile "README.md"

echo "Estructura creada con archivos vacíos."

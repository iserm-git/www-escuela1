import {
  Home as HomeIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  Class as ClassIcon,
  Assessment as ReportIcon,
  EventAvailable as AsistenciaIcon,
  Grade as CalificacionIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  Mail as MailIcon,
} from "@mui/icons-material";

// ========================================
// TIPOS
// ========================================

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  roles?: string[];
}

export interface NavGroup {
  title: string;
  icon?: React.ComponentType<any>;
  children: NavLink[];
  roles?: string[];
}

export type NavItem = NavLink | NavGroup;

// ========================================
// FUNCIÓN PARA IDENTIFICAR GRUPOS
// ========================================

export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

// ========================================
// LINKS DE NAVEGACIÓN PRINCIPALES
// ========================================

export const NAV_LINKS: NavItem[] = [
  {
    href: "/home",
    label: "Inicio",
    icon: HomeIcon,
  },
  {
    title: "Gestión Académica",
    icon: SchoolIcon,
    children: [
      {
        href: "/alumnos",
        label: "Alumnos",
        icon: PeopleIcon,
      },
      {
        href: "/profesores",
        label: "Profesores",
        icon: PersonIcon,
      },
      {
        href: "/materias",
        label: "Materias",
        icon: MenuBookIcon,
      },
      {
        href: "/grupos",
        label: "Grupos",
        icon: ClassIcon,
      },
    ],
  },
  {
    title: "Gestión de Curso",
    icon: SchoolIcon,
    children: [
      {
        href: "/gestion-curso/asistencia",
        label: "Asistencia",
        icon: AsistenciaIcon,
      },
      {
        href: "/gestion-curso/calificaciones",
        label: "Calificaciones",
        icon: CalificacionIcon,
      },
    ],
  },
  {
    href: "/reportes",
    label: "Reportes",
    icon: ReportIcon,
  },
];

// ========================================
// LINKS DEL SIDEBAR (Navegación Principal)
// ========================================

export const SIDEBAR_LINKS: NavItem[] = [
  {
    href: "/home",
    label: "Dashboard",
    icon: DashboardIcon,
  },
  {
    href: "/alumnos",
    label: "Alumnos",
    icon: PeopleIcon,
  },
  {
    href: "/profesores",
    label: "Profesores",
    icon: PersonIcon,
  },
  {
    href: "/materias",
    label: "Materias",
    icon: MenuBookIcon,
  },
  {
    href: "/grupos",
    label: "Grupos",
    icon: ClassIcon,
  },
  {
    title: "Gestión de Curso",
    icon: SchoolIcon,
    children: [
      {
        href: "/gestion-curso/asistencia",
        label: "Asistencia",
        icon: AsistenciaIcon,
      },
      {
        href: "/gestion-curso/calificaciones",
        label: "Calificaciones",
        icon: CalificacionIcon,
      },
    ],
  },
  {
    href: "/reportes",
    label: "Reportes",
    icon: ReportIcon,
  },
];

// ========================================
// LINKS PÚBLICOS (Sin autenticación)
// ========================================

export const PUBLIC_LINKS: NavLink[] = [
  {
    href: "/",
    label: "Inicio",
    icon: HomeIcon,
  },
  {
    href: "/login",
    label: "Iniciar Sesión",
  },
];

// ========================================
// LINKS POR ROL
// ========================================

export const ADMIN_LINKS: NavItem[] = [
  ...SIDEBAR_LINKS,
  {
    href: "/admin/usuarios",
    label: "Gestión de Usuarios",
    icon: PeopleIcon,
    roles: ["admin"],
  },
  {
    href: "/admin/configuracion",
    label: "Configuración",
    icon: SettingsIcon,
    roles: ["admin"],
  },
];

export const PROFESOR_LINKS: NavItem[] = [
  {
    href: "/home",
    label: "Dashboard",
    icon: DashboardIcon,
  },
  {
    href: "/mis-grupos",
    label: "Mis Grupos",
    icon: ClassIcon,
  },
  {
    title: "Gestión de Curso",
    icon: SchoolIcon,
    children: [
      {
        href: "/gestion-curso/asistencia",
        label: "Asistencia",
        icon: AsistenciaIcon,
      },
      {
        href: "/gestion-curso/calificaciones",
        label: "Calificaciones",
        icon: CalificacionIcon,
      },
    ],
  },
  {
    href: "/reportes",
    label: "Reportes",
    icon: ReportIcon,
  },
];

export const ALUMNO_LINKS: NavItem[] = [
  {
    href: "/home",
    label: "Inicio",
    icon: HomeIcon,
  },
  {
    href: "/mi-kardex",
    label: "Mi Kárdex",
    icon: AssignmentIcon,
  },
  {
    href: "/mi-asistencia",
    label: "Mi Asistencia",
    icon: AsistenciaIcon,
  },
  {
    href: "/mis-calificaciones",
    label: "Mis Calificaciones",
    icon: CalificacionIcon,
  },
];

// ========================================
// FUNCIÓN PARA OBTENER LINKS POR ROL
// ========================================

export function getNavigationByRole(role?: string): NavItem[] {
  switch (role) {
    case "admin":
      return ADMIN_LINKS;
    case "profesor":
      return PROFESOR_LINKS;
    case "alumno":
      return ALUMNO_LINKS;
    default:
      return SIDEBAR_LINKS;
  }
}

// ========================================
// FUNCIÓN PARA FILTRAR POR PERMISOS
// ========================================

export function filterByPermissions(
  items: NavItem[],
  userRoles: string[]
): NavItem[] {
  return items.filter((item) => {
    if (isNavGroup(item)) {
      const filteredChildren = item.children.filter((child) => {
        if (!child.roles) return true;
        return child.roles.some((role) => userRoles.includes(role));
      });

      if (filteredChildren.length > 0) {
        return true;
      }

      if (item.roles) {
        return item.roles.some((role) => userRoles.includes(role));
      }

      return filteredChildren.length > 0;
    }

    if (!item.roles) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });
}

// ========================================
// BREADCRUMBS MAPPING
// ========================================

export const BREADCRUMB_LABELS: Record<string, string> = {
  home: "Inicio",
  alumnos: "Alumnos",
  profesores: "Profesores",
  materias: "Materias",
  grupos: "Grupos",
  reportes: "Reportes",
  "gestion-curso": "Gestión de Curso",
  asistencia: "Asistencia",
  calificaciones: "Calificaciones",
  registrar: "Registrar",
  nuevo: "Nuevo",
  editar: "Editar",
  detalle: "Detalle",
  login: "Iniciar Sesión",
  registrar: "Registrarse",
  recuperar: "Recuperar Contraseña",
  admin: "Administración",
  usuarios: "Usuarios",
  configuracion: "Configuración",
};

// ========================================
// FUNCIÓN PARA GENERAR BREADCRUMBS
// ========================================

export function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Inicio", href: "/home" }];

  let currentPath = "";
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const label = BREADCRUMB_LABELS[path] || path;
    breadcrumbs.push({ label, href: currentPath });
  });

  return breadcrumbs;
}

// ========================================
// RUTAS PROTEGIDAS
// ========================================

export const PROTECTED_ROUTES = [
  "/home",
  "/alumnos",
  "/profesores",
  "/materias",
  "/grupos",
  "/gestion-curso",
  "/reportes",
  "/admin",
];

export const PUBLIC_ROUTES = ["/", "/login", "/registrar", "/recuperar"];

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

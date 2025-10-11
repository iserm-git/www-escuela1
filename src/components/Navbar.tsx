"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box, Stack } from "@mui/material";

// Íconos
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School"; // Título "Sistema Escolar"
import GroupIcon from "@mui/icons-material/Group"; // Alumnos
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"; // Profesores
import MenuBookIcon from "@mui/icons-material/MenuBook"; // Materias
import ClassIcon from "@mui/icons-material/Class"; // Grupos
import AssessmentIcon from "@mui/icons-material/Assessment"; // Reportes
import SettingsIcon from "@mui/icons-material/Settings"; // Gestión escolar

const MENU_ITEMS = [
  {
    label: "Inicio",
    href: "/home",
    icon: <HomeIcon fontSize="small" />,
  },
  { label: "Alumnos", href: "/alumnos", icon: <GroupIcon fontSize="small" /> },
  {
    label: "Profesores",
    href: "/profesores",
    icon: <PersonOutlineIcon fontSize="small" />,
  },
  {
    label: "Materias",
    href: "/materias",
    icon: <MenuBookIcon fontSize="small" />,
  },
  { label: "Grupos", href: "/grupos", icon: <ClassIcon fontSize="small" /> },
  {
    label: "Reportes",
    href: "/reportes",
    icon: <AssessmentIcon fontSize="small" />,
  },
  {
    label: "Gestión escolar",
    href: "/gestion",
    icon: <SettingsIcon fontSize="small" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="static" color="primary">
      <Toolbar
        sx={{
          gap: 0,
          flexWrap: "wrap",
          alignItems: "center",
          // Todo alineado a la izquierda:
          justifyContent: "flex-start",
        }}
      >
        {/* Icono + Título a la izquierda */}
        <Stack direction="row" spacing={1} alignItems="center">
          <SchoolIcon />
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            Sistema Escolar
          </Typography>
        </Stack>

        {/* Menú: alineado a la izquierda, un poco después del título */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            ml: { xs: 2, sm: 3, md: 4 }, // separación “un poco después” del título
          }}
        >
          {MENU_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                size="small"
                startIcon={item.icon} // 👈 icono a la izquierda de cada opción
                variant={active ? "contained" : "text"}
                color={active ? "primary" : "inherit"}
                sx={
                  active
                    ? {
                        bgcolor: "common.white",
                        color: "secondary.main",
                        "&:hover": { bgcolor: "grey.100" },
                      }
                    : undefined
                }
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

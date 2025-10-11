"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";

// Íconos
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

// Configuración del menú principal
const MENU_ITEMS = [
  { label: "Inicio", href: "/home" },
  { label: "Alumnos", href: "/alumnos" },
  { label: "Profesores", href: "/profesores" },
  { label: "Materias", href: "/materias" },
  { label: "Grupos", href: "/grupos" },
  { label: "Reportes", href: "/reportes" },
  { label: "Gestión escolar", href: "/gestion" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Estado para menú móvil (Drawer)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Estado para menú de usuario (Desktop)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Handlers para drawer móvil
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handlers para menú de usuario
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    // Aquí integrarías tu lógica de logout del AuthContext
    router.push("/login");
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    router.push("/perfil");
  };

  // Verifica si una ruta está activa
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Drawer para móvil
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      {/* Logo en drawer */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ py: 2 }}
      >
        <SchoolIcon color="primary" />
        <Typography variant="h6" color="primary">
          Sistema Escolar
        </Typography>
      </Stack>

      <Divider />

      {/* Lista de navegación */}
      <List>
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.href);

          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={active}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.main",
                    },
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo Desktop (oculto en móvil) */}
          <SchoolIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Sistema Escolar
          </Typography>

          {/* Menú hamburguesa (solo móvil) */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu de navegación"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo móvil (centrado) */}
          <SchoolIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/home"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Sistema Escolar
          </Typography>

          {/* Menú Desktop (oculto en móvil) */}
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}
          >
            {MENU_ITEMS.map((item) => {
              const active = isActive(item.href);

              return (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: "white",
                    display: "block",
                    bgcolor: active
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Menú de usuario */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="cuenta del usuario"
              aria-controls="menu-user"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Mi Perfil</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cerrar Sesión</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      {/* Drawer móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en móvil
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

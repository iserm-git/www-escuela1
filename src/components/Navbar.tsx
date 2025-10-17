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
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ExpandLess,
  ExpandMore,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

// Importar configuración de navegación
import { SIDEBAR_LINKS, isNavGroup, type NavItem } from "@/config/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Estado para menú móvil (Drawer)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Estado para menú de usuario
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Estado para submenús en desktop
  const [anchorElMenu, setAnchorElMenu] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  // Estado para submenús en móvil (drawer)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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

  // Handlers para submenús desktop
  const handleOpenSubmenu = (
    key: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElMenu({ ...anchorElMenu, [key]: event.currentTarget });
  };

  const handleCloseSubmenu = (key: string) => {
    setAnchorElMenu({ ...anchorElMenu, [key]: null });
  };

  // Handler para submenús móvil
  const handleToggleMobileSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  // Verifica si una ruta está activa
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Verifica si un grupo tiene una ruta activa
  const isGroupActive = (children: any[]) => {
    return children.some((child) => isActive(child.href));
  };

  // Drawer para móvil
  const drawer = (
    <Box sx={{ textAlign: "center" }}>
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
        {SIDEBAR_LINKS.map((item) => {
          // Si es un grupo con submenú
          if (isNavGroup(item)) {
            const isOpen = openSubmenu === item.title;
            const hasActiveChild = isGroupActive(item.children);

            return (
              <Box key={item.title}>
                <ListItemButton
                  onClick={() => handleToggleMobileSubmenu(item.title)}
                  selected={hasActiveChild}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  {item.icon && (
                    <ListItemIcon>
                      <item.icon
                        sx={{
                          color: hasActiveChild
                            ? "primary.contrastText"
                            : "inherit",
                        }}
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={item.title} />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      const active = isActive(child.href);
                      return (
                        <ListItemButton
                          key={child.href}
                          component={Link}
                          href={child.href}
                          selected={active}
                          sx={{
                            pl: 4,
                            "&.Mui-selected": {
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                            },
                          }}
                          onClick={handleDrawerToggle}
                        >
                          {child.icon && (
                            <ListItemIcon>
                              <child.icon
                                fontSize="small"
                                sx={{
                                  color: active
                                    ? "primary.contrastText"
                                    : "inherit",
                                }}
                              />
                            </ListItemIcon>
                          )}
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          // Si es un link simple
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
                onClick={handleDrawerToggle}
              >
                {item.icon && (
                  <ListItemIcon>
                    <item.icon
                      sx={{
                        color: active ? "primary.contrastText" : "inherit",
                      }}
                    />
                  </ListItemIcon>
                )}
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
              aria-label="menú de navegación"
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
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 0.5 }}
          >
            {SIDEBAR_LINKS.map((item) => {
              // Si es un grupo con submenú
              if (isNavGroup(item)) {
                const menuKey = item.title;
                const hasActiveChild = isGroupActive(item.children);
                const isSubmenuOpen = Boolean(anchorElMenu[menuKey]);

                return (
                  <Box key={item.title}>
                    <Button
                      onClick={(e) => handleOpenSubmenu(menuKey, e)}
                      endIcon={<ArrowDropDownIcon />}
                      startIcon={item.icon && <item.icon />}
                      sx={{
                        color: "white",
                        bgcolor:
                          hasActiveChild || isSubmenuOpen
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      {item.title}
                    </Button>

                    <Menu
                      anchorEl={anchorElMenu[menuKey]}
                      open={isSubmenuOpen}
                      onClose={() => handleCloseSubmenu(menuKey)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      {item.children.map((child) => {
                        const active = isActive(child.href);
                        return (
                          <MenuItem
                            key={child.href}
                            component={Link}
                            href={child.href}
                            onClick={() => handleCloseSubmenu(menuKey)}
                            selected={active}
                          >
                            {child.icon && (
                              <ListItemIcon>
                                <child.icon fontSize="small" />
                              </ListItemIcon>
                            )}
                            <ListItemText>{child.label}</ListItemText>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Box>
                );
              }

              // Si es un link simple
              const active = isActive(item.href);
              return (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon && <item.icon />}
                  sx={{
                    color: "white",
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
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

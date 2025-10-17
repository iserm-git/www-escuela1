"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Box, Container, Breadcrumbs, Typography, Stack } from "@mui/material";
import {
  School as SchoolIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Protected from "@/components/Protected";

export default function GestionCursoLayoutSimple({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const breadcrumbs = [
    { label: "Inicio", href: "/home" },
    { label: "Gestión de Curso", href: "/gestion-curso" },
  ];

  if (pathname.includes("/asistencia")) {
    breadcrumbs.push({
      label: "Asistencia",
      href: "/gestion-curso/asistencia",
    });
  } else if (pathname.includes("/calificaciones")) {
    breadcrumbs.push({
      label: "Calificaciones",
      href: "/gestion-curso/calificaciones",
    });
  }

  return (
    <Protected>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography
                key={crumb.href}
                color="text.primary"
                fontWeight={500}
              >
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.href}
                href={crumb.href}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  color="text.secondary"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  {crumb.label}
                </Typography>
              </Link>
            );
          })}
        </Breadcrumbs>

        {children}
      </Container>
    </Protected>
  );
}

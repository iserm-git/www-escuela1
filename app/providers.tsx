// apps/reactjs/lw2025/www-escuela/app/providers.tsx
"use client";

import * as React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { esES as coreEsES } from "@mui/material/locale";
import { esES as dataGridEsES } from "@mui/x-data-grid/locales";
import { esES as pickersEsES } from "@mui/x-date-pickers/locales";
import { AuthProvider } from "@/context/AuthContext"; // 👈 importa tu context

const theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#9c27b0" },
      background: { default: "#fafafa" },
    },
    shape: { borderRadius: 12 },
  },
  coreEsES,
  dataGridEsES,
  pickersEsES
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {" "}
      {/* 👈 envuelve TODO el árbol */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

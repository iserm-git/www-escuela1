// src/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  nombre: string;
  email: string;
  role?: "admin" | "docente" | "alumno";
};
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "app.auth.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al montar
  useEffect(() => {
    try {
      const persisted =
        typeof window !== "undefined" &&
        (localStorage.getItem(STORAGE_KEY) ??
          sessionStorage.getItem(STORAGE_KEY));
      if (persisted) setUser(JSON.parse(persisted));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    // Simulación (aquí llamarías a tu API real)
    await new Promise((r) => setTimeout(r, 600));

    // Validación mínima de ejemplo
    if (!email || !password) throw new Error("Ingresa usuario y contraseña.");
    // Simula credenciales inválidas
    if (password !== "123456") throw new Error("Credenciales inválidas.");

    const logged: User = { id: "1", nombre: "Admin", email, role: "admin" };
    setUser(logged);

    // Persistencia
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(logged));
    // Limpia el otro almacenamiento por si acaso
    (remember ? sessionStorage : localStorage).removeItem(STORAGE_KEY);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

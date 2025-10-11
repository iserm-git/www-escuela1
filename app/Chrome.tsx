"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login"; // oculta Navbar/Footer en /login

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}

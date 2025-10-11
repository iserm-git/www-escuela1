import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Chrome from "./Chrome";

export const metadata: Metadata = {
  title: "Gestión Escolar",
  description: "Panel administrativo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Chrome>{children}</Chrome>
        </Providers>
      </body>
    </html>
  );
}

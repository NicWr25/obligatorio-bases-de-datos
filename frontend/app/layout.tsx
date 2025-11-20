import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Reservas UCU",
  description: "Frontend para gestionar reservas de salas, participantes y sanciones",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100">
        <Providers>
          <Navbar />
          <main className="container py-8 space-y-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

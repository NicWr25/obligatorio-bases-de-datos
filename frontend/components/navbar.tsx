"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/salas", label: "Salas" },
  { href: "/participantes/create", label: "Participantes" },
  { href: "/reservas/1", label: "Reservas" },
  { href: "/sanciones", label: "Sanciones" },
  { href: "/analytics", label: "Analytics" },
  { href: "/login", label: "Login" }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1224]/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold text-white">
          Reservas UCU
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-lg px-3 py-2 font-medium transition",
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

"use client";

import { FormCard } from "@/components/form-card";
import {
  getEdificios,
  getPorcentajeReservasUtilizadas,
  getReservasYAsistenciasPorRol,
  getSalasMasReservadas,
  getTurnosMasDemandados,
} from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function DashboardPage() {
  const { data: edificios, isLoading } = useQuery({ queryKey: ["edificios"], queryFn: getEdificios });
  const { data: topSalas } = useQuery({ queryKey: ["analytics", "salas"], queryFn: getSalasMasReservadas });
  const { data: turnos } = useQuery({ queryKey: ["analytics", "turnos"], queryFn: getTurnosMasDemandados });
  const { data: porcentaje } = useQuery({ queryKey: ["analytics", "porcentaje"], queryFn: getPorcentajeReservasUtilizadas });
  const { data: reservasPorRol } = useQuery({ queryKey: ["analytics", "roles"], queryFn: getReservasYAsistenciasPorRol });

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-300">Información en vivo basada en el backend FastAPI.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/salas" className="btn-primary">Reservar sala</Link>
            <Link href="/analytics" className="btn-outline">Ver analytics</Link>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-400">Salas registradas</p>
          <p className="mt-2 text-3xl font-semibold">
            {isLoading ? "..." : edificios?.edificios.reduce((acc, e) => acc + e.salas.length, 0) || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Edificios</p>
          <p className="mt-2 text-3xl font-semibold">{isLoading ? "..." : edificios?.edificios.length ?? 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Reservas utilizadas</p>
          <p className="mt-2 text-3xl font-semibold">
            {porcentaje?.[0]?.porcentaje_reservas_utilizadas?.toFixed(2) ?? "0"}%
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <FormCard title="Top salas más reservadas">
          <div className="space-y-2 text-sm">
            {topSalas?.map((item) => (
              <div key={item.nombre_sala} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <div>
                  <p className="font-semibold">{item.nombre_sala}</p>
                  <p className="text-slate-400">Reservas</p>
                </div>
                <span className="text-lg font-bold text-accent">{item.total_reservas}</span>
              </div>
            )) || <p className="text-slate-400">Sin datos</p>}
          </div>
        </FormCard>

        <FormCard title="Turnos con más demanda">
          <div className="space-y-2 text-sm">
            {turnos?.map((turno) => (
              <div key={turno.hora_inicio} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <div>
                  <p className="font-semibold">Inicio {turno.hora_inicio}</p>
                  <p className="text-slate-400">Reservas</p>
                </div>
                <span className="text-lg font-bold text-accent">{turno.total_reservas}</span>
              </div>
            )) || <p className="text-slate-400">Sin datos</p>}
          </div>
        </FormCard>
      </div>

      <FormCard title="Reservas y asistencias por rol">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {reservasPorRol?.map((item) => (
            <div key={item.rol} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Rol</p>
              <p className="text-lg font-semibold">{item.rol}</p>
              <p className="text-sm text-slate-400 mt-2">Reservas</p>
              <p className="text-xl font-bold text-accent">{item.cantidad_reservas}</p>
              <p className="text-sm text-slate-400 mt-2">Asistencias registradas</p>
              <p className="text-xl font-bold text-emerald-400">{item.cantidad_asistencias}</p>
            </div>
          )) || <p className="text-slate-400">Sin datos</p>}
        </div>
      </FormCard>
    </div>
  );
}

"use client";

import { FormCard } from "@/components/form-card";
import {
  getCantidadReservasPorSala,
  getPorcentajeOcupacionEdificio,
  getPromedioParticipantesSala,
  getReservasCarreraYFacultad,
  getReservasYAsistenciasPorRol,
  getSalasMasReservadas,
  getSalasMenosReservadas,
  getSancionesPorRol,
  getTurnosMasDemandados,
  getTurnosMenosDemandados,
} from "@/services/api";
import { useQueries } from "@tanstack/react-query";

export default function AnalyticsPage() {
  const results = useQueries({
    queries: [
      { queryKey: ["analytics", "salas-mas"], queryFn: getSalasMasReservadas },
      { queryKey: ["analytics", "salas-menos"], queryFn: getSalasMenosReservadas },
      { queryKey: ["analytics", "turnos-mas"], queryFn: getTurnosMasDemandados },
      { queryKey: ["analytics", "turnos-menos"], queryFn: getTurnosMenosDemandados },
      { queryKey: ["analytics", "promedio"], queryFn: getPromedioParticipantesSala },
      { queryKey: ["analytics", "carrera"], queryFn: getReservasCarreraYFacultad },
      { queryKey: ["analytics", "ocupacion"], queryFn: getPorcentajeOcupacionEdificio },
      { queryKey: ["analytics", "rol-reservas"], queryFn: getReservasYAsistenciasPorRol },
      { queryKey: ["analytics", "rol-sanciones"], queryFn: getSancionesPorRol },
      { queryKey: ["analytics", "reservas-sala"], queryFn: getCantidadReservasPorSala },
    ],
  });

  const [salasMas, salasMenos, turnosMas, turnosMenos, promedio, carrera, ocupacion, reservasRol, sancionesRol, reservasSala] =
    results.map((r) => r.data || []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-slate-300">Visualización directa de los endpoints bajo /analytics.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <DataList title="Salas más reservadas" items={salasMas.map((s) => `${s.nombre_sala}: ${s.total_reservas}`)} />
        <DataList title="Salas menos reservadas" items={salasMenos.map((s) => `${s.nombre_sala}: ${s.total_reservas}`)} />
        <DataList title="Turnos más demandados" items={turnosMas.map((t) => `${t.hora_inicio}: ${t.total_reservas}`)} />
        <DataList title="Turnos menos demandados" items={turnosMenos.map((t) => `${t.hora_inicio}: ${t.total_reservas}`)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormCard title="Promedio de asistencia por sala">
          <Table headers={["Sala", "Promedio"]} rows={promedio.map((p) => [p.nombre_sala, p.promedio_asistencia?.toFixed(2)])} />
        </FormCard>
        <FormCard title="Reservas por sala">
          <Table headers={["Sala", "Reservas"]} rows={reservasSala.map((p) => [p.nombre_sala, p.cantidad_reservas])} />
        </FormCard>
      </div>

      <FormCard title="Reservas por carrera y facultad">
        <Table
          headers={["Facultad", "Carrera", "Cantidad"]}
          rows={carrera.map((c) => [c.facultad, c.carrera, c.cantidad])}
        />
      </FormCard>

      <div className="grid gap-4 md:grid-cols-2">
        <FormCard title="Ocupación de salas por edificio">
          <Table headers={["Edificio", "% Ocupación"]} rows={ocupacion.map((o) => [o.nombre_edificio, `${o.porcentaje_ocupacion}%`])} />
        </FormCard>
        <FormCard title="Reservas y asistencias por rol">
          <Table
            headers={["Rol", "Reservas", "Asistencias"]}
            rows={reservasRol.map((r) => [r.rol, r.cantidad_reservas, r.cantidad_asistencias])}
          />
        </FormCard>
        <FormCard title="Sanciones por rol">
          <Table headers={["Rol", "Sanciones"]} rows={sancionesRol.map((s) => [s.rol, s.cantidad_sanciones])} />
        </FormCard>
      </div>
    </div>
  );
}

function DataList({ title, items }: { title: string; items: (string | number)[] }) {
  return (
    <FormCard title={title}>
      <ul className="space-y-2 text-sm">
        {items.length === 0 && <li className="text-slate-400">Sin datos</li>}
        {items.map((item, idx) => (
          <li key={idx} className="rounded-lg bg-white/5 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </FormCard>
  );
}

function Table({ headers, rows }: { headers: (string | number)[]; rows: (string | number | undefined)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400">
            {headers.map((h, idx) => (
              <th key={idx} className="px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-2 text-slate-400" colSpan={headers.length}>
                Sin datos
              </td>
            </tr>
          )}
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-white/5">
              {row.map((cell, cidx) => (
                <td key={cidx} className="px-3 py-2">
                  {cell ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { FormCard } from "@/components/form-card";
import {
  crearSancion,
  eliminarSancion,
  modificarSancion,
  obtenerSanciones,
  validarSancion,
} from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

export default function SancionesPage() {
  const [ciConsulta, setCiConsulta] = useState("");
  const [ciValidar, setCiValidar] = useState("");

  const consulta = useMutation({ mutationFn: obtenerSanciones });
  const validacion = useMutation({ mutationFn: validarSancion });
  const crear = useMutation({ mutationFn: (data: { ci: string; inicio: string; fin: string }) =>
    crearSancion(data.ci, data.inicio, data.fin)
  });
  const modificar = useMutation({ mutationFn: (data: { ci: string; inicio: string; fin: string }) =>
    modificarSancion(data.ci, data.inicio, data.fin)
  });
  const eliminar = useMutation({ mutationFn: (data: { ci: string; inicio: string }) => eliminarSancion(data.ci, data.inicio) });

  const onConsulta = (event: FormEvent) => {
    event.preventDefault();
    if (ciConsulta) consulta.mutate(ciConsulta);
  };

  const onValidar = (event: FormEvent) => {
    event.preventDefault();
    if (ciValidar) validacion.mutate(ciValidar);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormCard title="Consultar sanciones" description="GET /sanciones/{ci_participante}">
        <form className="space-y-3" onSubmit={onConsulta}>
          <div>
            <label>Cédula</label>
            <input value={ciConsulta} onChange={(e) => setCiConsulta(e.target.value)} />
          </div>
          <button className="btn-primary" type="submit" disabled={consulta.isPending}>
            {consulta.isPending ? "Buscando..." : "Consultar"}
          </button>
        </form>
        {consulta.data?.sanciones && (
          <ul className="mt-4 space-y-2 text-sm">
            {consulta.data.sanciones.map((s, idx) => (
              <li key={idx} className="rounded-lg bg-white/5 p-3">
                <p>Inicio: {s.fecha_inicio}</p>
                <p>Fin: {s.fecha_fin}</p>
              </li>
            ))}
          </ul>
        )}
        {consulta.data?.message && <p className="text-slate-300 mt-2">{consulta.data.message}</p>}
        {consulta.isError && <p className="text-sm text-red-400">{(consulta.error as Error).message}</p>}
      </FormCard>

      <FormCard title="Validar sanción activa" description="GET /sanciones/validar_sancion/{ci}">
        <form className="space-y-3" onSubmit={onValidar}>
          <div>
            <label>Cédula</label>
            <input value={ciValidar} onChange={(e) => setCiValidar(e.target.value)} />
          </div>
          <button className="btn-outline" type="submit" disabled={validacion.isPending}>
            {validacion.isPending ? "Validando..." : "Validar"}
          </button>
        </form>
        {validacion.data && (
          <p className="mt-3 text-sm">
            {validacion.data.bloqueado ? "Tiene sanción activa" : "Sin sanciones"} - {validacion.data.message}
          </p>
        )}
        {validacion.isError && <p className="text-sm text-red-400">{(validacion.error as Error).message}</p>}
      </FormCard>

      <FormCard title="Crear sanción" description="POST /sanciones/crear (query params)">
        <SancionForm
          submitLabel="Crear"
          onSubmit={(ci, inicio, fin) => crear.mutate({ ci, inicio, fin })}
          pending={crear.isPending}
          success={crear.isSuccess ? "Sanción creada" : null}
          error={crear.isError ? (crear.error as Error).message : null}
        />
      </FormCard>

      <FormCard title="Modificar sanción" description="PUT /sanciones/modificar">
        <SancionForm
          submitLabel="Actualizar"
          onSubmit={(ci, inicio, fin) => modificar.mutate({ ci, inicio, fin })}
          pending={modificar.isPending}
          success={modificar.isSuccess ? "Sanción modificada" : null}
          error={modificar.isError ? (modificar.error as Error).message : null}
        />
      </FormCard>

      <FormCard title="Eliminar sanción" description="DELETE /sanciones/{ci}/{fecha_inicio}">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const ci = (form.elements.namedItem("ci") as HTMLInputElement).value;
            const inicio = (form.elements.namedItem("inicio") as HTMLInputElement).value;
            eliminar.mutate({ ci, inicio });
          }}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label>Cédula</label>
              <input name="ci" />
            </div>
            <div>
              <label>Fecha inicio</label>
              <input name="inicio" type="date" />
            </div>
          </div>
          <button className="btn-outline" type="submit" disabled={eliminar.isPending}>
            {eliminar.isPending ? "Eliminando..." : "Eliminar"}
          </button>
          {eliminar.isSuccess && <p className="text-sm text-emerald-400">Sanción eliminada</p>}
          {eliminar.isError && <p className="text-sm text-red-400">{(eliminar.error as Error).message}</p>}
        </form>
      </FormCard>
    </div>
  );
}

function SancionForm({
  submitLabel,
  onSubmit,
  pending,
  success,
  error,
}: {
  submitLabel: string;
  pending: boolean;
  success: string | null;
  error: string | null;
  onSubmit: (ci: string, inicio: string, fin: string) => void;
}) {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const ci = (form.elements.namedItem("ci") as HTMLInputElement).value;
        const inicio = (form.elements.namedItem("inicio") as HTMLInputElement).value;
        const fin = (form.elements.namedItem("fin") as HTMLInputElement).value;
        onSubmit(ci, inicio, fin);
      }}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label>Cédula</label>
          <input name="ci" />
        </div>
        <div>
          <label>Fecha inicio</label>
          <input name="inicio" type="date" />
        </div>
        <div>
          <label>Fecha fin</label>
          <input name="fin" type="date" />
        </div>
      </div>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Enviando..." : submitLabel}
      </button>
      {success && <p className="text-sm text-emerald-400">{success}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}

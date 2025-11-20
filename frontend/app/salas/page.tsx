"use client";

import { FormCard } from "@/components/form-card";
import { marcarAsistencia, reservarSala, getEdificios } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const reservaSchema = z.object({
  id_sala: z.number({ required_error: "Sala requerida" }),
  fecha: z.string().min(1, "Fecha requerida"),
  id_turno: z.number({ required_error: "Turno requerido" }),
  ci_participante: z.string().min(7, "Cédula requerida"),
});

const asistenciaSchema = z.object({
  id_reserva: z.number({ required_error: "ID de reserva requerido" }),
});

export default function SalasPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["edificios"], queryFn: getEdificios });

  const reservaForm = useForm<z.infer<typeof reservaSchema>>({
    resolver: zodResolver(reservaSchema),
    defaultValues: { id_turno: 1 },
  });

  const asistenciaForm = useForm<z.infer<typeof asistenciaSchema>>({
    resolver: zodResolver(asistenciaSchema),
  });

  const reservaMutation = useMutation({
    mutationFn: reservarSala,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edificios"] });
      reservaForm.reset();
    },
  });

  const asistenciaMutation = useMutation({
    mutationFn: marcarAsistencia,
    onSuccess: () => asistenciaForm.reset(),
  });

  const salas = data?.edificios.flatMap((edificio) =>
    edificio.salas.map((sala) => ({ ...sala, edificio: edificio.nombre_edificio }))
  );

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Salas disponibles</h1>
        <p className="text-slate-300">Datos obtenidos de GET /salas/</p>
      </div>

      {isLoading && <p className="text-slate-400">Cargando salas...</p>}
      {error && <p className="text-red-400">{String(error)}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {salas?.map((sala) => (
          <div key={sala.id_sala} className="card space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{sala.edificio}</p>
                <h3 className="text-lg font-semibold">{sala.nombre_sala}</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase">{sala.tipo_sala}</span>
            </div>
            <p className="text-slate-300 text-sm">Capacidad: {sala.capacidad}</p>
            <p className="text-slate-400 text-xs">ID sala: {sala.id_sala}</p>
          </div>
        )) || <p className="text-slate-400">Sin salas</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormCard title="Reservar sala" description="POST /salas/reservar">
          <form
            className="space-y-3"
            onSubmit={reservaForm.handleSubmit((values) =>
              reservaMutation.mutate({
                ...values,
                id_sala: Number(values.id_sala),
                id_turno: Number(values.id_turno),
              })
            )}
          >
            <div>
              <label>Sala</label>
              <select {...reservaForm.register("id_sala", { valueAsNumber: true })}>
                <option value="">Selecciona</option>
                {salas?.map((sala) => (
                  <option key={sala.id_sala} value={sala.id_sala}>
                    {sala.nombre_sala} ({sala.edificio})
                  </option>
                ))}
              </select>
              {reservaForm.formState.errors.id_sala && (
                <p className="text-sm text-red-400">{reservaForm.formState.errors.id_sala.message as string}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label>Fecha</label>
                <input type="date" {...reservaForm.register("fecha")} />
                {reservaForm.formState.errors.fecha && (
                  <p className="text-sm text-red-400">{reservaForm.formState.errors.fecha.message}</p>
                )}
              </div>
              <div>
                <label>Turno (id)</label>
                <input type="number" min="1" {...reservaForm.register("id_turno", { valueAsNumber: true })} />
                {reservaForm.formState.errors.id_turno && (
                  <p className="text-sm text-red-400">{reservaForm.formState.errors.id_turno.message as string}</p>
                )}
              </div>
            </div>
            <div>
              <label>Cédula participante</label>
              <input type="text" {...reservaForm.register("ci_participante")} />
              {reservaForm.formState.errors.ci_participante && (
                <p className="text-sm text-red-400">{reservaForm.formState.errors.ci_participante.message}</p>
              )}
            </div>
            <button className="btn-primary" type="submit" disabled={reservaMutation.isPending}>
              {reservaMutation.isPending ? "Creando..." : "Reservar"}
            </button>
            {reservaMutation.isSuccess && (
              <p className="text-sm text-emerald-400">Reserva #{reservaMutation.data?.id_reserva} creada</p>
            )}
            {reservaMutation.isError && (
              <p className="text-sm text-red-400">{(reservaMutation.error as Error).message}</p>
            )}
          </form>
        </FormCard>

        <FormCard title="Registrar asistencia" description="PUT /salas/asistir">
          <form
            className="space-y-3"
            onSubmit={asistenciaForm.handleSubmit((values) =>
              asistenciaMutation.mutate({ id_reserva: Number(values.id_reserva) })
            )}
          >
            <div>
              <label>ID de reserva</label>
              <input type="number" {...asistenciaForm.register("id_reserva", { valueAsNumber: true })} />
              {asistenciaForm.formState.errors.id_reserva && (
                <p className="text-sm text-red-400">{asistenciaForm.formState.errors.id_reserva.message as string}</p>
              )}
            </div>
            <button className="btn-outline" type="submit" disabled={asistenciaMutation.isPending}>
              {asistenciaMutation.isPending ? "Guardando..." : "Sumar asistencia"}
            </button>
            {asistenciaMutation.isSuccess && (
              <p className="text-sm text-emerald-400">{asistenciaMutation.data?.message}</p>
            )}
            {asistenciaMutation.isError && (
              <p className="text-sm text-red-400">{(asistenciaMutation.error as Error).message}</p>
            )}
          </form>
        </FormCard>
      </div>
    </div>
  );
}

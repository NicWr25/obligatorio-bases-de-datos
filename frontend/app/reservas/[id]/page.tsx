"use client";

import { FormCard } from "@/components/form-card";
import { actualizarReserva } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    id_sala: z.coerce.number().optional(),
    fecha: z.string().optional(),
    id_turno: z.coerce.number().optional(),
    participantes: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined && v !== ""), {
    message: "Envía al menos un cambio",
  });

export default function ReservaDetailPage() {
  const params = useParams<{ id: string }>();
  const reservaId = Number(params.id);

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) =>
      actualizarReserva(reservaId, {
        ...values,
        participantes: values.participantes
          ? values.participantes.split(",").map((ci) => ci.trim()).filter(Boolean)
          : undefined,
      }),
  });

  return (
    <FormCard
      title={`Actualizar reserva #${reservaId}`}
      description="PUT /admin/reservas/{id_reserva}. Utiliza fechas en formato YYYY-MM-DD."
    >
      <form className="space-y-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label>ID sala</label>
            <input type="number" {...form.register("id_sala", { valueAsNumber: true })} />
          </div>
          <div>
            <label>Fecha</label>
            <input type="date" {...form.register("fecha")} />
          </div>
          <div>
            <label>ID turno</label>
            <input type="number" {...form.register("id_turno", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <label>Participantes (CI separadas por coma)</label>
          <textarea rows={2} placeholder="12345678, 23456789" {...form.register("participantes")} />
        </div>
        {form.formState.errors.root && <p className="text-sm text-red-400">{form.formState.errors.root.message}</p>}
        <button className="btn-primary" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Guardando..." : "Guardar cambios"}
        </button>
        {mutation.isSuccess && <p className="text-sm text-emerald-400">Reserva actualizada</p>}
        {mutation.isError && <p className="text-sm text-red-400">{(mutation.error as Error).message}</p>}
      </form>
    </FormCard>
  );
}

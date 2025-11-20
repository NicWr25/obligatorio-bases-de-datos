"use client";

import { FormCard } from "@/components/form-card";
import { actualizarSala, eliminarSala, getEdificios } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    nombre_sala: z.string().optional(),
    id_edificio: z.coerce.number().optional(),
    capacidad: z.coerce.number().optional(),
    tipo_sala: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined && v !== ""), {
    message: "Debes indicar al menos un cambio",
  });

export default function SalaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const salaId = Number(params.id);
  const queryClient = useQueryClient();

  const { data } = useQuery({ queryKey: ["edificios"], queryFn: getEdificios });
  const sala = data?.edificios.flatMap((e) => e.salas.map((s) => ({ ...s, edificio: e.nombre_edificio }))).find((s) => s.id_sala === salaId);

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const updateMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => actualizarSala(salaId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edificios"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => eliminarSala(salaId),
    onSuccess: () => router.push("/salas"),
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Sala #{salaId}</h1>
        {sala ? (
          <div className="mt-3 text-sm text-slate-300 space-y-1">
            <p>Nombre: {sala.nombre_sala}</p>
            <p>Edificio: {sala.edificio}</p>
            <p>Capacidad: {sala.capacidad}</p>
            <p>Tipo: {sala.tipo_sala}</p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No se encontró la sala en la respuesta de GET /salas/</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormCard
          title="Actualizar sala"
          description="PUT /admin/salas/{id_sala}. Deja en blanco los campos que no quieras modificar."
        >
          <form className="space-y-3" onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}>
            <div>
              <label>Nombre</label>
              <input type="text" placeholder={sala?.nombre_sala} {...form.register("nombre_sala")} />
            </div>
            <div>
              <label>ID edificio</label>
              <input type="number" placeholder={sala?.id_edificio?.toString()} {...form.register("id_edificio", { valueAsNumber: true })} />
            </div>
            <div>
              <label>Capacidad</label>
              <input type="number" placeholder={sala?.capacidad?.toString()} {...form.register("capacidad", { valueAsNumber: true })} />
            </div>
            <div>
              <label>Tipo de sala</label>
              <select defaultValue="" {...form.register("tipo_sala")}>
                <option value="">Sin cambio</option>
                <option value="libre">libre</option>
                <option value="posgrado">posgrado</option>
                <option value="docente">docente</option>
              </select>
            </div>
            {form.formState.errors.root && <p className="text-sm text-red-400">{form.formState.errors.root.message}</p>}
            <button className="btn-primary" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Actualizando..." : "Guardar cambios"}
            </button>
            {updateMutation.isSuccess && <p className="text-sm text-emerald-400">Sala actualizada</p>}
            {updateMutation.isError && <p className="text-sm text-red-400">{(updateMutation.error as Error).message}</p>}
          </form>
        </FormCard>

        <FormCard title="Eliminar sala" description="DELETE /admin/salas/{id_sala}">
          <p className="text-slate-300 text-sm">
            Esta acción requiere que la sala no tenga reservas futuras activas.
          </p>
          <button
            className="btn-outline"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </button>
          {deleteMutation.isError && <p className="text-sm text-red-400">{(deleteMutation.error as Error).message}</p>}
        </FormCard>
      </div>
    </div>
  );
}

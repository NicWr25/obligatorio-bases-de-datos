"use client";

import { FormCard } from "@/components/form-card";
import { actualizarParticipante, eliminarParticipante } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    id_programa: z.coerce.number().optional(),
    rol: z.enum(["alumno", "docente"]).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined && v !== ""), {
    message: "Envía al menos un cambio",
  });

export default function ParticipanteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const ci = params.id;

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const updateMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => actualizarParticipante(ci, values),
  });

  const deleteMutation = useMutation({
    mutationFn: () => eliminarParticipante(ci),
    onSuccess: () => router.push("/participantes/create"),
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormCard title={`Actualizar participante ${ci}`} description="PUT /admin/participantes/{ci}">
        <form className="space-y-3" onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label>Nombre</label>
              <input type="text" {...form.register("nombre")} />
            </div>
            <div>
              <label>Apellido</label>
              <input type="text" {...form.register("apellido")} />
            </div>
          </div>
          <div>
            <label>Email</label>
            <input type="email" {...form.register("email")} />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label>Contraseña</label>
              <input type="password" {...form.register("password")} />
            </div>
            <div>
              <label>Programa académico (id)</label>
              <input type="number" {...form.register("id_programa", { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <label>Rol</label>
            <select defaultValue="" {...form.register("rol")}>
              <option value="">Sin cambio</option>
              <option value="alumno">alumno</option>
              <option value="docente">docente</option>
            </select>
          </div>
          {form.formState.errors.root && <p className="text-sm text-red-400">{form.formState.errors.root.message}</p>}
          <button className="btn-primary" type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Guardando..." : "Actualizar"}
          </button>
          {updateMutation.isSuccess && <p className="text-sm text-emerald-400">Datos guardados</p>}
          {updateMutation.isError && <p className="text-sm text-red-400">{(updateMutation.error as Error).message}</p>}
        </form>
      </FormCard>

      <FormCard title="Eliminar participante" description="DELETE /admin/participantes/{ci}">
        <p className="text-sm text-slate-300">Requiere no tener reservas activas ni sanciones vigentes.</p>
        <button className="btn-outline" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
          {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
        </button>
        {deleteMutation.isError && <p className="text-sm text-red-400">{(deleteMutation.error as Error).message}</p>}
      </FormCard>
    </div>
  );
}

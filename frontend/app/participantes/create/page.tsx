"use client";

import { FormCard } from "@/components/form-card";
import { crearParticipante } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  ci: z.string().min(7),
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  id_programa: z.coerce.number(),
  rol: z.enum(["alumno", "docente"]),
});

export default function CrearParticipantePage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const mutation = useMutation({ mutationFn: crearParticipante, onSuccess: () => form.reset() });

  return (
    <FormCard title="Crear participante" description="POST /admin/participantes">
      <form className="space-y-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label>Cédula</label>
            <input type="text" {...form.register("ci")} />
          </div>
          <div>
            <label>Programa académico (id)</label>
            <input type="number" {...form.register("id_programa", { valueAsNumber: true })} />
          </div>
        </div>
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
            <label>Rol</label>
            <select {...form.register("rol")}>
              <option value="alumno">alumno</option>
              <option value="docente">docente</option>
            </select>
          </div>
        </div>
        <button className="btn-primary" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creando..." : "Crear participante"}
        </button>
        {mutation.isSuccess && <p className="text-sm text-emerald-400">Participante creado</p>}
        {mutation.isError && <p className="text-sm text-red-400">{(mutation.error as Error).message}</p>}
      </form>
    </FormCard>
  );
}

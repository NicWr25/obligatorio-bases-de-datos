"use client";

import { FormCard } from "@/components/form-card";
import { crearSala } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  nombre_sala: z.string().min(2),
  id_edificio: z.coerce.number(),
  capacidad: z.coerce.number().positive(),
  tipo_sala: z.enum(["libre", "posgrado", "docente"]),
});

export default function CrearSalaPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const mutation = useMutation({ mutationFn: crearSala, onSuccess: () => form.reset() });

  return (
    <FormCard title="Crear sala" description="POST /admin/salas">
      <form className="space-y-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div>
          <label>Nombre</label>
          <input type="text" {...form.register("nombre_sala")} />
        </div>
        <div>
          <label>ID edificio</label>
          <input type="number" {...form.register("id_edificio", { valueAsNumber: true })} />
        </div>
        <div>
          <label>Capacidad</label>
          <input type="number" {...form.register("capacidad", { valueAsNumber: true })} />
        </div>
        <div>
          <label>Tipo de sala</label>
          <select {...form.register("tipo_sala")}> 
            <option value="libre">libre</option>
            <option value="posgrado">posgrado</option>
            <option value="docente">docente</option>
          </select>
        </div>
        <button className="btn-primary" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creando..." : "Crear sala"}
        </button>
        {mutation.isSuccess && <p className="text-sm text-emerald-400">Sala creada correctamente</p>}
        {mutation.isError && <p className="text-sm text-red-400">{(mutation.error as Error).message}</p>}
      </form>
    </FormCard>
  );
}

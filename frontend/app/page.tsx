import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-bold">Reservas académicas</h1>
        <p className="mt-2 text-slate-300">
          Explora salas disponibles, gestiona participantes y visualiza las métricas provistas por el backend de FastAPI.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn-primary">Ir al dashboard</Link>
          <Link href="/salas" className="btn-outline">Ver salas</Link>
        </div>
      </section>
    </div>
  );
}

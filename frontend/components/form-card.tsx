import { ReactNode } from "react";

export function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description && <p className="text-slate-300 text-sm mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

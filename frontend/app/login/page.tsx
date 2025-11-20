"use client";

import { FormCard } from "@/components/form-card";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(1, "Contraseña requerida"),
});

const registerSchema = z.object({
  ci: z.string().min(7, "Cédula requerida"),
  name: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function LoginPage() {
  const { login, register, error, user, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setSuccessMessage(null);
    await login(values);
    setSuccessMessage("Inicio de sesión exitoso");
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setSuccessMessage(null);
    await register(values);
    setSuccessMessage("Usuario registrado, ahora puedes iniciar sesión");
    registerForm.reset();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormCard title="Iniciar sesión" description="Autenticación contra /auth/login.">
        <form className="space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...loginForm.register("email")} />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-400">{loginForm.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" {...loginForm.register("password")} />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-400">{loginForm.formState.errors.password.message}</p>
            )}
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Validando..." : "Ingresar"}
          </button>
        </form>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {user && (
          <div className="mt-4 rounded-lg bg-white/5 p-3 text-sm text-slate-200">
            <p className="font-semibold">Sesión iniciada</p>
            <p>{user.nombre} {user.apellido} ({user.email})</p>
          </div>
        )}
      </FormCard>

      <FormCard title="Crear cuenta" description="Registra un participante mediante /auth/register.">
        <form className="space-y-4" onSubmit={registerForm.handleSubmit(handleRegister)}>
          <div>
            <label htmlFor="ci">Cédula</label>
            <input id="ci" type="text" {...registerForm.register("ci")} />
            {registerForm.formState.errors.ci && (
              <p className="text-sm text-red-400">{registerForm.formState.errors.ci.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name">Nombre</label>
              <input id="name" type="text" {...registerForm.register("name")} />
            </div>
            <div>
              <label htmlFor="surname">Apellido</label>
              <input id="surname" type="text" {...registerForm.register("surname")} />
            </div>
          </div>
          <div>
            <label htmlFor="email-register">Email</label>
            <input id="email-register" type="email" {...registerForm.register("email")} />
          </div>
          <div>
            <label htmlFor="password-register">Contraseña</label>
            <input id="password-register" type="password" {...registerForm.register("password")} />
            {registerForm.formState.errors.password && (
              <p className="text-sm text-red-400">{registerForm.formState.errors.password.message}</p>
            )}
          </div>
          <button className="btn-outline" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Registrar"}
          </button>
        </form>
        {successMessage && <p className="text-sm text-emerald-400">{successMessage}</p>}
        <p className="text-xs text-slate-400 mt-2">
          Después de registrarte, utiliza el mismo correo y contraseña para iniciar sesión.
          Vuelve al <Link className="text-accent" href="/dashboard">dashboard</Link> para operar.
        </p>
      </FormCard>
    </div>
  );
}

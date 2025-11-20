"use client";

import { useEffect, useState } from "react";
import { loginUser, registerUser } from "@/services/api";
import { LoginCredentials, RegistrationCredentials, UserInfo } from "@/types/auth";

interface AuthState {
  user: UserInfo | null;
  token: string | null;
}

const STORAGE_KEY = "reservas-auth";

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, token: null });
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setState(JSON.parse(saved));
    }
    setHydrated(true);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials);
      const payload = { user: response.user, token: response.token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setState(payload);
    } catch (err: any) {
      setError(err?.message || "No se pudo iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegistrationCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(credentials);
    } catch (err: any) {
      setError(err?.message || "No se pudo registrar");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, token: null });
  };

  return {
    ...state,
    hydrated,
    loading,
    error,
    login,
    logout,
    register,
  };
}

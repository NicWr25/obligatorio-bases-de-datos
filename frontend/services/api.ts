import {
  LoginCredentials,
  LoginResponse,
  RegistrationCredentials,
  RegistrationResponse,
} from "@/types/auth";
import {
  AsistenciaRequest,
  AsistenciaResponse,
  EdificiosResponse,
  ReservaRequest,
  ReservaResponse,
} from "@/types/salas";
import {
  ParticipanteCreate,
  ParticipanteUpdate,
  ReservaUpdate,
  SalaCreate,
  SalaUpdate,
} from "@/types/admin";
import { SancionListResponse, ValidacionSancion } from "@/types/sanciones";
import {
  OcupacionEdificio,
  PorcentajeReservasUsadas,
  PromedioAsistencia,
  ReservasAsistenciasPorRol,
  ReservasCarreraFacultad,
  ReservasPorSala,
  SalaReservaStat,
  SancionesPorRol,
  TurnoStat,
} from "@/types/analytics";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  let data: any = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const detail = typeof data === "string" ? data : data?.detail || data?.message;
    throw new Error(detail || "Error al comunicarse con la API");
  }

  return data as T;
}

// Auth
export const registerUser = (payload: RegistrationCredentials) =>
  request<RegistrationResponse>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload: LoginCredentials) =>
  request<LoginResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Salas
export const getEdificios = () => request<EdificiosResponse>(`/salas/`);

export const reservarSala = (payload: ReservaRequest) =>
  request<ReservaResponse>(`/salas/reservar`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const marcarAsistencia = (payload: AsistenciaRequest) =>
  request<AsistenciaResponse>(`/salas/asistir`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// Sanciones
export const obtenerSanciones = (ci: string) => request<SancionListResponse>(`/sanciones/${ci}`);

export const validarSancion = (ci: string) => request<ValidacionSancion>(`/sanciones/validar_sancion/${ci}`);

export const crearSancion = (ci_participante: string, fecha_inicio: string, fecha_fin: string) => {
  const params = new URLSearchParams({ ci_participante, fecha_inicio, fecha_fin });
  return request<{ message: string }>(`/sanciones/crear?${params.toString()}`, {
    method: "POST",
  });
};

export const eliminarSancion = (ci: string, fecha_inicio: string) =>
  request<{ message: string }>(`/sanciones/${ci}/${fecha_inicio}`, {
    method: "DELETE",
  });

export const modificarSancion = (ci_participante: string, fecha_inicio: string, nueva_fecha_fin: string) => {
  const params = new URLSearchParams({ ci_participante, fecha_inicio, nueva_fecha_fin });
  return request<{ message: string }>(`/sanciones/modificar?${params.toString()}`, {
    method: "PUT",
  });
};

// Participantes (Administrativo)
export const crearParticipante = (payload: ParticipanteCreate) =>
  request<{ message: string }>(`/admin/participantes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const actualizarParticipante = (ci: string, payload: ParticipanteUpdate) =>
  request<{ message: string }>(`/admin/participantes/${ci}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const eliminarParticipante = (ci: string) =>
  request<{ message: string }>(`/admin/participantes/${ci}`, {
    method: "DELETE",
  });

// Salas (Administrativo)
export const crearSala = (payload: SalaCreate) =>
  request<{ message: string }>(`/admin/salas`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const actualizarSala = (id: number, payload: SalaUpdate) =>
  request<{ message: string }>(`/admin/salas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const eliminarSala = (id: number) =>
  request<{ message: string }>(`/admin/salas/${id}`, {
    method: "DELETE",
  });

// Reservas (Administrativo)
export const actualizarReserva = (id: number, payload: ReservaUpdate) =>
  request<{ message: string }>(`/admin/reservas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// Analytics
export const getSalasMasReservadas = () => request<SalaReservaStat[]>(`/analytics/salas-mas-reservadas`);
export const getTurnosMasDemandados = () => request<TurnoStat[]>(`/analytics/turnos-mas-demandados`);
export const getPromedioParticipantesSala = () => request<PromedioAsistencia[]>(`/analytics/promedio-participantes-sala`);
export const getReservasCarreraYFacultad = () =>
  request<ReservasCarreraFacultad[]>(`/analytics/cantidad-reservas-carrera-y-facultad`);
export const getPorcentajeOcupacionEdificio = () =>
  request<OcupacionEdificio[]>(`/analytics/porcentaje-ocupacion-salas-edificio`);
export const getReservasYAsistenciasPorRol = () =>
  request<ReservasAsistenciasPorRol[]>(`/analytics/cantidad-reservas-asistencias-tipo-usuario`);
export const getSancionesPorRol = () => request<SancionesPorRol[]>(`/analytics/cantidad-sanciones-tipo-usuario`);
export const getPorcentajeReservasUtilizadas = () =>
  request<PorcentajeReservasUsadas[]>(`/analytics/porcentaje-reservas-efectivamente-utilizadas`);
export const getSalasMenosReservadas = () => request<SalaReservaStat[]>(`/analytics/salas-menos-reservadas`);
export const getTurnosMenosDemandados = () => request<TurnoStat[]>(`/analytics/turnos-menos-demandados`);
export const getCantidadReservasPorSala = () => request<ReservasPorSala[]>(`/analytics/cantidad-reservas-por-sala`);

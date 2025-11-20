export interface Sancion {
  fecha_inicio: string;
  fecha_fin: string;
}

export interface SancionListResponse {
  sanciones?: Sancion[];
  message?: string;
}

export interface ValidacionSancion {
  bloqueado: boolean;
  message: string;
}

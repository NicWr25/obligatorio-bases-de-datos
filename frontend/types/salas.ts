export interface Sala {
  id_sala: number;
  nombre_sala: string;
  capacidad: number;
  tipo_sala: string;
}

export interface Edificio {
  id_edificio: number;
  nombre_edificio: string;
  salas: Sala[];
}

export interface EdificiosResponse {
  edificios: Edificio[];
}

export interface ReservaRequest {
  id_sala: number;
  fecha: string;
  id_turno: number;
  ci_participante: string;
}

export interface ReservaResponse {
  message: string;
  id_reserva: number;
  estado: string;
}

export interface AsistenciaRequest {
  id_reserva: number;
}

export interface AsistenciaResponse {
  message: string;
}

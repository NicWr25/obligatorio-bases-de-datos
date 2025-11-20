export interface ParticipanteCreate {
  ci: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  id_programa: number;
  rol: string;
}

export interface ParticipanteUpdate {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  id_programa?: number;
  rol?: string;
}

export interface SalaCreate {
  nombre_sala: string;
  id_edificio: number;
  capacidad: number;
  tipo_sala: string;
}

export interface SalaUpdate {
  nombre_sala?: string;
  id_edificio?: number;
  capacidad?: number;
  tipo_sala?: string;
}

export interface ReservaUpdate {
  id_sala?: number;
  fecha?: string;
  id_turno?: number;
  participantes?: string[];
}

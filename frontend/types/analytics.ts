export interface SalaReservaStat {
  nombre_sala: string;
  total_reservas: number;
}

export interface TurnoStat {
  hora_inicio: string;
  total_reservas: number;
}

export interface PromedioAsistencia {
  nombre_sala: string;
  promedio_asistencia: number;
}

export interface ReservasCarreraFacultad {
  facultad: string;
  carrera: string;
  cantidad: number;
}

export interface OcupacionEdificio {
  nombre_edificio: string;
  porcentaje_ocupacion: number;
}

export interface ReservasAsistenciasPorRol {
  rol: string;
  cantidad_reservas: number;
  cantidad_asistencias: number;
}

export interface SancionesPorRol {
  rol: string;
  cantidad_sanciones: number;
}

export interface PorcentajeReservasUsadas {
  porcentaje_reservas_utilizadas: number;
}

export interface ReservasPorSala {
  nombre_sala: string;
  cantidad_reservas: number;
}

export interface RegistrationCredentials {
  ci: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface RegistrationResponse {
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserInfo {
  user_id: number;
  ci: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserInfo;
}

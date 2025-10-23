export interface DBUsuario {
  id: number;
  nombre: string;
  email: string;
  creado_en: Date;
}

export interface CrearUsuarioDTO {
  usuario: string;
  email: string;
  clave: string;
}

export interface LoginDTO {
  usuario: string;
  clave: string;
}
export interface RegistrarUsuarioMensaje {
  ok: boolean;
  nombreDisponible: boolean;
  emailDisponible: boolean;
}

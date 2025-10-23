import { FichaBase } from "@domain/ficha/fichaBase";

export class Usuario {
  constructor(
    public readonly id: number,
    public nombre: string,
    public email: string,
    public creado_en: Date,
    //public conexion: WebSocket = null,

    public mazos: number[] = [],
    public fichas: FichaBase[] = []
  ) {}

  cambiarNombre(nuevoNombre: string) {
    this.nombre = nuevoNombre.trim();
  }
  agregarFicha(ficha: FichaBase) {
    this.fichas.push(ficha);
  }
}

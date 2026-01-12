import { FichaBase } from "@domain/ficha/fichaBase";
import { Mazo } from "@domain/mazo/mazo";
import { Partida } from "@domain/partida/partida";
import { Jugador } from "./jugador";

export class Usuario {
  public mazoActual: Mazo = null;
  public mazos: Mazo[] = [];
  public fichas: FichaBase[] = [];

  public partida_actial: Partida;
  public jugador_actual: Jugador;
  constructor(
    public readonly id: number,
    public nombre: string,
    public email: string,
    public creado_en: Date,
    public conexion: WebSocket = null
  ) {}

  cambiarNombre(nuevoNombre: string) {
    this.nombre = nuevoNombre.trim();
  }
  agregarFicha(ficha: FichaBase) {
    this.fichas.push(ficha);
  }
  seleccionarMazo(mazo: Mazo) {
    this.mazoActual = mazo;
  }
  getMazoPorNombre(nombre: string): Mazo | null {
    console.log("Buscando mazo por nombre:", nombre);
    console.log(this.mazos);
    for (const mazo of this.mazos) {
      if (mazo.nombre === nombre) {
        return mazo;
      }
    }
  }
}

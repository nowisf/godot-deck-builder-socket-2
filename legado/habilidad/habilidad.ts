import { Ficha } from "@domain/ficha/ficha";
import { FichaBase } from "@domain/ficha/fichaBase";
import { Jugador } from "@domain/usuario/jugador";

export class Habilidad {
  public enfriamiento: number = 0;
  constructor(
    public id: number,
    public nombre: string,
    public acciones: Function[],
    public tiempoDeReutilizacion: number,
    public amo: Jugador,
    public fichaBase: FichaBase
  ) {}
  agregarAccion(accion: Function) {
    this.acciones.push(accion);
  }
  ejecutar() {
    for (const accion of this.acciones) {
      accion();
    }
  }
  modificarEnfriamiento(cambio: number) {
    if (this.enfriamiento + cambio < 0) {
      this.enfriamiento = 0;
      return;
    }
    this.enfriamiento += cambio;
  }
}

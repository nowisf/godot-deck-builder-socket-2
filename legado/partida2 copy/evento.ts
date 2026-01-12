import { Fase } from "./fase";
import { Efecto } from "./efectos/efecto";
import { ejecutarEfectos } from "./efectos/registradorEfectos";

/**
 * Un Evento representa un conjunto de efectos que se ejecutan en una fase.
 * Ejemplo: "inicio de turno", "fin de turno", "muerte de unidad", etc.
 */
export class Evento {
  public efectos: Efecto[] = [];

  constructor(
    public readonly fase: Fase,
    efectosIniciales: Efecto[] = [],
    public nombre: string = "Evento sin nombre"
  ) {
    this.efectos = efectosIniciales;
  }

  agregarEfecto(efecto: Efecto) {
    this.efectos.push(efecto);
  }

  async ejecutar() {
    if (this.efectos.length === 0) {
      console.log(
        `⚠️ Evento '${this.nombre}' (${this.fase}) no tiene efectos.`
      );
      return;
    }

    console.log(`🎬 Ejecutando evento '${this.nombre}' (${this.fase})...`);
    await ejecutarEfectos(this.efectos);
    console.log(`✅ Evento '${this.nombre}' finalizado.`);
  }
}

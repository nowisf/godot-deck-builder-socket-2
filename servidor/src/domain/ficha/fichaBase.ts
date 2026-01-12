import { HabilidadBase } from "@domain/partida/habilidad/habilidadBase";

export class FichaBase {
  public readonly coste: number;
  public readonly tiempoReutilizacion: number;
  public readonly enfriamientoInicial: number;
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly imagenFicha: string,
    public readonly imagenSet: string,
    /** Stats base de la ficha (ataque, vida, rangoVisión, etc.) */
    public readonly stats: Record<string, number> = {},
    public habilidadesBase: HabilidadBase[] = []
  ) {
    this.coste = stats["coste"] || 0;
    this.tiempoReutilizacion = stats["tiempoReutilizacion"] || 0;
    this.enfriamientoInicial = stats["enfriamientoInicial"] || 0;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      imagenFicha: this.imagenFicha,
      imagenSet: this.imagenSet,
      coste: this.coste,
      stats: this.stats,
    };
  }
}

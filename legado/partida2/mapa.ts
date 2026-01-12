import { Casilla } from "./casilla";
import { Jugador } from "@domain/usuario/jugador";

export class Mapa {
  public casillas: Casilla[][] = [];
  public ancho: number;
  public alto: number;

  constructor(ancho: number, alto: number) {
    this.ancho = ancho;
    this.alto = alto;

    // Crear casillas
    for (let y = 0; y < alto; y++) {
      const fila: Casilla[] = [];
      for (let x = 0; x < ancho; x++) {
        fila.push(new Casilla({ x, y }, this));
      }
      this.casillas.push(fila);
    }

    // Conectar caminos básicos (izq-der)
    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const actual = this.casillas[y][x];
        if (x < ancho - 1)
          actual.setProp("caminoSiguiente", this.casillas[y][x + 1]);
        if (x > 0) actual.setProp("caminoAnterior", this.casillas[y][x - 1]);
      }
    }
  }

  /** Devuelve una casilla por coordenadas */
  obtenerCasilla(x: number, y: number): Casilla | null {
    return this.casillas[y]?.[x] ?? null;
  }

  /**
   * Devuelve las casillas dentro del rango especificado.
   * - rangoMin: puede ser 0 para incluir el centro.
   * - rangoMax: es la distancia máxima (inclusiva).
   */
  obtenerAro(centro: Casilla, rangoMin: number, rangoMax: number): Casilla[] {
    const { x, y } = centro.coordenadas;
    const resultado: Casilla[] = [];

    for (let dy = -rangoMax; dy <= rangoMax; dy++) {
      for (let dx = -rangoMax; dx <= rangoMax; dx++) {
        const distancia = Math.max(Math.abs(dx), Math.abs(dy));
        if (distancia < rangoMin || distancia > rangoMax) continue;

        const nx = x + dx;
        const ny = y + dy;
        const destino = this.casillas[ny]?.[nx];
        if (destino) resultado.push(destino);
      }
    }
    return resultado;
  }

  /**
   * Devuelve todos los "aros" entre dos rangos (ej: de 2 a 5).
   * Ideal para actualizar visión incrementalmente.
   */
  obtenerAros(centro: Casilla, rangoMin: number, rangoMax: number): Casilla[] {
    const resultado: Casilla[] = [];
    for (let r = rangoMin; r <= rangoMax; r++) {
      resultado.push(...this.obtenerAro(centro, r, r));
    }
    return resultado;
  }

  /** Recalcula visión desde una casilla cuando cambia el rango */
  actualizarVisionJugadorDesdeCasilla(
    jugador: Jugador,
    casilla: Casilla,
    rangoAnterior: number,
    rangoNuevo: number
  ) {
    if (rangoAnterior === rangoNuevo) return;

    if (rangoNuevo > rangoAnterior) {
      const nuevas = this.obtenerAros(casilla, rangoAnterior + 1, rangoNuevo);
      for (const c of nuevas) {
        c.agregarVisionDesde(jugador, casilla);
      }
    } else {
      const perdidas = this.obtenerAros(casilla, rangoNuevo + 1, rangoAnterior);
      for (const c of perdidas) {
        c.removerVisionDesde(jugador, casilla);
      }
    }
  }
}

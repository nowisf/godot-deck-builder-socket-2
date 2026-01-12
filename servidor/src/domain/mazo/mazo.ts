import { FichaBase } from "@domain/ficha/fichaBase";

export class Mazo {
  static readonly MAX_FICHAS = 10;

  constructor(
    public readonly id: number,
    public nombre: string,
    public fichas: (FichaBase | null)[] = Array(Mazo.MAX_FICHAS).fill(null)
  ) {}

  /** Agrega una ficha en la primera posición libre */
  agregarFicha(ficha: FichaBase) {
    if (this.contieneFicha(ficha.id)) {
      throw new Error(`La ficha con ID "${ficha.id}" ya está en el mazo.`);
    }

    const indexLibre = this.fichas.findIndex((f) => f === null);
    if (indexLibre === -1) {
      throw new Error("El mazo ya contiene el número máximo de fichas (10).");
    }

    this.fichas[indexLibre] = ficha;
  }

  /** Cambia o asigna una ficha en una posición específica */
  setFichaEnPosicion(posicion: number, ficha: FichaBase | null) {
    if (posicion < 0 || posicion >= Mazo.MAX_FICHAS) {
      throw new Error("Posición fuera de rango.");
    }

    if (ficha && this.contieneFicha(ficha.id)) {
      throw new Error(`La ficha con ID "${ficha.id}" ya está en el mazo.`);
    }

    this.fichas[posicion] = ficha;
  }

  quitarFicha(fichaId: number) {
    const index = this.fichas.findIndex((f) => f?.id === fichaId);
    if (index === -1) {
      throw new Error(
        `No se encontró la ficha con ID "${fichaId}" en el mazo.`
      );
    }
    this.fichas[index] = null;
  }

  vaciar() {
    this.fichas = Array(Mazo.MAX_FICHAS).fill(null);
  }

  contieneFicha(fichaId: number): boolean {
    return this.fichas.some((f) => f?.id === fichaId);
  }

  /** Devuelve true si las 10 posiciones están ocupadas */
  estaCompleto(): boolean {
    return this.fichas.every((f) => f !== null);
  }

  /** Intercambia dos fichas de posición */
  intercambiar(pos1: number, pos2: number) {
    if (
      pos1 < 0 ||
      pos1 >= Mazo.MAX_FICHAS ||
      pos2 < 0 ||
      pos2 >= Mazo.MAX_FICHAS
    ) {
      throw new Error("Posición fuera de rango.");
    }
    const temp = this.fichas[pos1];
    this.fichas[pos1] = this.fichas[pos2];
    this.fichas[pos2] = temp;
  }

  /** Crea una copia del mazo */
  clonar(): Mazo {
    return new Mazo(this.id, this.nombre, [...this.fichas]);
  }
}

import { Ficha } from "@domain/ficha/ficha";
import { Casilla } from "./casilla";
import { Coords } from "./coords";
import { Jugador } from "@domain/usuario/jugador";

export type FormaArea = "diamante" | "cuadrado";

export class Tablero {
  public casillas: Map<string, Casilla> = new Map();
  public fichas: Map<number, Ficha> = new Map();

  constructor(public ancho: number, public alto: number) {
    this.ancho = ancho;
    this.alto = alto;

    // Crear todas las casillas automáticamente
    for (let x = 0; x < ancho; x++) {
      for (let y = 0; y < alto; y++) {
        const coords = { x, y };
        const key = this.key(coords);
        this.casillas.set(key, new Casilla(coords));
      }
    }
  }

  private key(coords: Coords) {
    return `${coords.x},${coords.y}`;
  }

  colocarCasilla(coords: Coords) {
    const key = this.key(coords);
    this.casillas.set(key, new Casilla(coords));
    return this.casillas.get(key)!;
  }

  getCasilla(coords: Coords) {
    const key = this.key(coords);
    return this.casillas.get(key) ?? null;
  }

  colocarFicha(ficha: Ficha, coords: Coords) {
    this.fichas.set(ficha.id, ficha);
    const casilla = this.getCasilla(coords);
    ficha.coords = coords;
    casilla?.unidades.push(ficha);
  }

  moverFicha(ficha: Ficha, to: Coords) {
    const fromKey = this.key(ficha.coords);
    const from = this.casillas.get(fromKey);
    if (from) from.unidades = from.unidades.filter((u) => u.id !== ficha.id);
    ficha.coords = to;
    const toCasilla = this.getCasilla(to);
    toCasilla?.unidades.push(ficha);
  }

  obtenerFicha(id: number) {
    return this.fichas.get(id) ?? null;
  }

  private distanciaDiamante(dx: number, dy: number) {
    // Manhattan
    return Math.abs(dx) + Math.abs(dy);
  }

  private distanciaCuadrado(dx: number, dy: number) {
    // Chebyshev
    return Math.max(Math.abs(dx), Math.abs(dy));
  }

  /** Devuelve la función de distancia correspondiente a la forma */
  private distanciaPorForma(forma: FormaArea) {
    return forma === "cuadrado"
      ? this.distanciaCuadrado
      : this.distanciaDiamante;
  }

  // ==============================
  //         Obtener Aro
  // ==============================

  obtenerAro(
    centro: Casilla,
    rangoMin: number,
    rangoMax: number,
    forma: FormaArea = "diamante"
  ): Casilla[] {
    const { x: cx, y: cy } = centro.coords;
    const distanciaFn = this.distanciaPorForma(forma);

    const casillas: Casilla[] = [];

    for (let dx = -rangoMax; dx <= rangoMax; dx++) {
      for (let dy = -rangoMax; dy <= rangoMax; dy++) {
        const d = distanciaFn(dx, dy);
        if (d < rangoMin || d > rangoMax) continue;

        const casilla = this.getCasilla({ x: cx + dx, y: cy + dy });
        if (casilla) casillas.push(casilla);
      }
    }

    return casillas;
  }

  obtenerFichasEnArea(
    centro: Casilla,
    rangoMin: number,
    rangoMax: number,
    forma: FormaArea = "diamante"
  ): Ficha[] {
    const casillas = this.obtenerAro(centro, rangoMin, rangoMax, forma);

    // Extrae y aplana todas las unidades
    return casillas.flatMap((c) => c.unidades);
  }
  agregarVisionEnRango(
    pos: Coords,
    distancia: number,
    forma: FormaArea,
    jugador: Jugador
  ) {
    const casillaCentro = this.getCasilla(pos);
    if (!casillaCentro) return;

    const casillas = this.obtenerAro(casillaCentro, 0, distancia, forma);

    for (const c of casillas) {
      c.agregarVision(jugador);
    }
  }

  quitarVisionEnRango(
    pos: Coords,
    distancia: number,
    forma: FormaArea,
    jugador: Jugador
  ) {
    const casillaCentro = this.getCasilla(pos);
    if (!casillaCentro) return;

    const casillas = this.obtenerAro(casillaCentro, 0, distancia, forma);

    for (const c of casillas) {
      c.quitarVision(jugador);
    }
  }
}

export function hacerCamino(secuencia: Coords[], tablero: Tablero) {
  for (let i = 0; i < secuencia.length; i++) {
    const coordsActual = secuencia[i];
    const casillaActual = tablero.getCasilla(coordsActual);

    if (!casillaActual) continue;

    const anterior = i > 0 ? tablero.getCasilla(secuencia[i - 1]) : null;
    const siguiente =
      i < secuencia.length - 1 ? tablero.getCasilla(secuencia[i + 1]) : null;

    if (anterior) casillaActual.setPropiedad("CasillaHaciaB", anterior);

    if (siguiente) casillaActual.setPropiedad("CasillaHaciaA", siguiente);

    casillaActual.setPropiedad("esCamino", true);
  }
}

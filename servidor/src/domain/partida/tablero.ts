import { Ficha } from "@domain/ficha/ficha";
import { Casilla, PropCasilla } from "./casilla";
import { Coords } from "./coords";
import { Jugador } from "@domain/usuario/jugador";

export enum FormaArea {
  DIAMANTE = "diamante",
  CUADRADO = "cuadrado",
}

export class Tablero {
  public casillas: Map<string, Casilla> = new Map();
  public fichas: Map<string, Ficha> = new Map();

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
    if (from) from.quitarFicha(ficha);
    ficha.coords = to;
    const toCasilla = this.getCasilla(to);
    toCasilla?.agregarFicha(ficha);
  }
  puedeAvanzar(ficha: Ficha): boolean {
    const casillaActual = ficha.casilla;
    if (!casillaActual) return false;

    const propDireccion =
      ficha.amo.bando === "A"
        ? PropCasilla.CAMINO_HACIA_A
        : PropCasilla.CAMINO_HACIA_B;

    const siguiente = casillaActual.props[propDireccion];

    return siguiente instanceof Casilla;
  }
  avanzarFicha(ficha: Ficha): { casillaActual: Casilla; siguiente: Casilla } {
    const casillaActual = ficha.casilla;
    if (!casillaActual) return null;

    const propDireccion =
      ficha.amo.bando === "A"
        ? PropCasilla.CAMINO_HACIA_A
        : PropCasilla.CAMINO_HACIA_B;

    const siguiente = casillaActual.props[propDireccion];

    if (!(siguiente instanceof Casilla)) return null;

    this.moverFicha(ficha, siguiente.coords);

    return { casillaActual, siguiente };
  }

  obtenerFicha(id: string): Ficha | null {
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
    return forma === FormaArea.CUADRADO
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
    forma: FormaArea = FormaArea.DIAMANTE
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
    forma: FormaArea = FormaArea.DIAMANTE
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
    console.log("agregando vicion desde tablero");
    const casillaCentro = this.getCasilla(pos);
    if (!casillaCentro) return;

    const casillas = this.obtenerAro(casillaCentro, 0, distancia, forma);

    for (const c of casillas) {
      console.log("agregando vicion en la casilla");
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

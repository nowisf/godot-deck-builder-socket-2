import { esFicha, Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Casilla } from "./casilla";
import { Mapa } from "./mapa";

export type MetodoSelector =
  | { tipo: "ALIADAS" }
  | { tipo: "ENEMIGAS" }
  | { tipo: "PROPIA" }
  | { tipo: "DAÑADAS" }
  | { tipo: "DISTANCIA"; min?: number; max: number }
  | { tipo: "CASILLA"; casilla: Casilla }
  | { tipo: "TODAS" };

export class SelectorObjetivo {
  private origen: Ficha | Jugador;
  private metodos: MetodoSelector[] = [];
  private maxCantidad: number | null = null;
  private mapa: Mapa;
  private fichas: Ficha[];

  constructor(origen: Ficha | Jugador, fichasEnJuego: Ficha[], mapa: Mapa) {
    this.origen = origen;
    this.fichas = fichasEnJuego;
    this.mapa = mapa;
  }

  /** Límite máximo de objetivos */
  max(cantidad: number) {
    this.maxCantidad = cantidad;
    return this;
  }

  /** Añade un método de selección */
  agregar(metodo: MetodoSelector) {
    this.metodos.push(metodo);
    return this;
  }

  /** Alias más bonito */
  usar(metodo: MetodoSelector) {
    return this.agregar(metodo);
  }

  /** Devuelve los objetivos finales */
  resolver(): Ficha[] {
    let resultado = [...this.fichas];

    for (const m of this.metodos) {
      switch (m.tipo) {
        case "TODAS":
          // no filtra nada
          break;

        case "PROPIA":
          if ("amo" in this.origen) resultado = [this.origen];
          break;

        case "ALIADAS":
          var amo = "amo" in this.origen ? this.origen.amo : this.origen;
          resultado = resultado.filter((f) => f.amo === amo);
          break;

        case "ENEMIGAS":
          var amo = "amo" in this.origen ? this.origen.amo : this.origen;
          resultado = resultado.filter((f) => f.amo != amo);
          break;

        case "DAÑADAS":
          resultado = resultado.filter(
            (f) => f.stats.vidaActual < f.stats.vidaMax
          );
          break;

        case "DISTANCIA":
          if ("amo" in this.origen && this.origen.casilla) {
            const origenCasilla = this.origen.casilla;
            const min = m.min ?? 0;
            const max = m.max;
            const aro = this.mapa.obtenerAros(origenCasilla, min, max);
            resultado = resultado.filter((f) => aro.includes(f.casilla));
          }
          break;

        case "CASILLA":
          resultado = resultado.filter((f) => f.casilla === m.casilla);
          break;
      }
    }

    // Limitar cantidad
    if (this.maxCantidad !== null) {
      resultado = resultado.slice(0, this.maxCantidad);
    }

    // Evitar duplicados
    return Array.from(new Set(resultado));
  }
}

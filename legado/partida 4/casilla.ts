import { Ficha } from "@domain/ficha/ficha";
import { Coords } from "./coords";
import { Tablero } from "./tablero";
import { Jugador } from "@domain/usuario/jugador";
/*
CasillaHaciaA: Casilla
CasillaHaciaB: Casilla
esCamino: boolean???


*/

export type EventoCasilla = {
  tipo: string;
  data?: any;
};

export class Casilla {
  public unidades: Ficha[] = [];
  public props: Record<string, unknown> = {};

  /** Jugadores que ven esta casilla */
  public jugadoresQueVen = new Set<Jugador>();

  /** Contadores internos de visión */
  private visionCount = new WeakMap<Jugador, number>();

  constructor(public coords: Coords) {}

  setPropiedad(nombre: string, valor: unknown) {
    this.props[nombre] = valor;
  }

  /* =============================
        VISIÓN
  ==============================*/

  agregarVision(jugador: Jugador) {
    const actual = this.visionCount.get(jugador) ?? 0;
    const nuevo = actual + 1;

    this.visionCount.set(jugador, nuevo);

    if (nuevo === 1) {
      this.jugadoresQueVen.add(jugador);
    }
  }

  quitarVision(jugador: Jugador) {
    const actual = this.visionCount.get(jugador);
    if (!actual) return;

    const nuevo = actual - 1;

    if (nuevo <= 0) {
      this.visionCount.delete(jugador);
      this.jugadoresQueVen.delete(jugador);
    } else {
      this.visionCount.set(jugador, nuevo);
    }
  }

  esVisiblePara(jugador: Jugador) {
    return this.jugadoresQueVen.has(jugador);
  }

  /* =============================
        NOTIFICACIÓN
  ==============================*/

  notificar(evento: EventoCasilla) {
    this.jugadoresQueVen.forEach((jugador) => {
      jugador.añadirNotificacion?.(evento);
    });
  }

  /* =============================
        Fichas
  ==============================*/

  agregarFicha(ficha: Ficha) {
    // Evita duplicados por seguridad
    if (!this.unidades.includes(ficha)) {
      this.unidades.push(ficha);
    }

    // Actualizamos las coords de la ficha para mantener coherencia
    ficha.coords = this.coords;
  }

  quitarFicha(ficha: Ficha) {
    const idx = this.unidades.indexOf(ficha);
    if (idx >= 0) {
      this.unidades.splice(idx, 1);
    }
  }
}

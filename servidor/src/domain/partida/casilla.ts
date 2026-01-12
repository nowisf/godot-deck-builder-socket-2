import { Ficha } from "@domain/ficha/ficha";
import { Coords } from "./coords";
import { Jugador } from "@domain/usuario/jugador";
import {
  generadorNotificaciones,
  TipoEvento,
} from "./notificaciones/notificacionesFactory";
/*
CasillaHaciaA: Casilla
CasillaHaciaB: Casilla
esCamino: boolean???


*/
export const enum PropCasilla {
  CAMINO_HACIA_A = "CasillaHaciaA",
  CAMINO_HACIA_B = "CasillaHaciaB",
  ES_CAMINO = "esCamino",
}

export enum NombresValdosas {
  PASTO = "pasto",
  PASTO_CAMINO = "pasto_camino",
}

export class Casilla {
  public unidades: Ficha[] = [];
  public tipoValdosa: NombresValdosas = NombresValdosas.PASTO;
  public props: Record<string, unknown> = {};

  /** Jugadores que ven esta casilla */
  public jugadoresQueVen = new Set<Jugador>();

  public jugadoresQueConocenBase = new Set<Jugador>();

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

    console.log("agregando vicion");

    if (nuevo === 1) {
      this.jugadoresQueVen.add(jugador);
      jugador.notificaciones.push(
        generadorNotificaciones[TipoEvento.VISIBILIDAD_CASILLA](this, true)
      );
      console.log("comunicando al jugador la casilla");
      for (const ficha of this.unidades) {
        const aliada = ficha.amo === jugador;
        jugador.notificaciones.push(
          generadorNotificaciones[TipoEvento.FICHA_REVELADA](ficha, aliada)
        );
      }
    }

    if (!this.jugadoresQueConocenBase.has(jugador)) {
      this.jugadoresQueConocenBase.add(jugador);
      jugador.notificaciones.push(
        generadorNotificaciones[TipoEvento.DESCUBRIR_BASE_CASILLA](this)
      );
    }
  }

  quitarVision(jugador: Jugador) {
    const actual = this.visionCount.get(jugador);
    if (!actual) return;

    const nuevo = actual - 1;

    if (nuevo <= 0) {
      this.visionCount.delete(jugador);
      this.jugadoresQueVen.delete(jugador);
      jugador.notificaciones.push(
        generadorNotificaciones[TipoEvento.VISIBILIDAD_CASILLA](this, false)
      );
    } else {
      this.visionCount.set(jugador, nuevo);
    }
  }

  esVisiblePara(jugador: Jugador) {
    return this.jugadoresQueVen.has(jugador);
  }

  /* =============================
        Fichas
  ==============================*/

  agregarFicha(ficha: Ficha) {
    if (!this.unidades.includes(ficha)) {
      this.unidades.push(ficha);
    }

    ficha.coords = this.coords;
    ficha.casilla = this;
  }

  quitarFicha(ficha: Ficha) {
    const idx = this.unidades.indexOf(ficha);
    if (idx >= 0) {
      this.unidades.splice(idx, 1);
    }
  }
}

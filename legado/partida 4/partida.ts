import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Fase } from "./fases/fase";
import { Casilla } from "./casilla";
import { Tablero } from "./tablero";
import { MotorWego } from "./motorWeGo";
import { preEfecto } from "./efecto/preEfecto/preEfecto";
import { FichaBase } from "@domain/ficha/fichaBase";

export class Partida {
  public bandoA: Jugador[] = [];
  public bandoB: Jugador[] = [];
  public fichasEnJuego: Ficha[] = [];
  public tablero: Tablero;
  public motorWego: MotorWego;

  private casillaInicialA: Casilla | null = null;
  private casillaInicialB: Casilla | null = null;

  private numeroTurno = 0;

  private ALTO_MAPA = 20;
  private ANCHO_MAPA = 20;

  constructor() {
    this.tablero = new Tablero(this.ANCHO_MAPA, this.ALTO_MAPA);
    this.motorWego = new MotorWego(this);
  }

  procesarInvocacionJugador(jugador: Jugador, fichaBase: FichaBase) {
    var efecto:

  }

  asignarAccion(jugador: Jugador, accion: preEfecto) {
    jugador.accionPendiente = accion;
  }

  /** Ejecuta todas las acciones pendientes y limpia después */
  ejecutarTurno() {
    this.numeroTurno++;
    console.log(`\n--- Ejecutando turno ${this.numeroTurno} ---`);

    const todos = [...this.bandoA, ...this.bandoB];

    for (const jugador of todos) {
      const accion = jugador.accionPendiente;
      if (!accion) continue;

      if (accion.tipo === "JUGAR_FICHA") {
        this.jugarFicha(jugador, accion.indiceFicha);
      }

      jugador.accionPendiente = null;
    }

    console.log(`--- Fin del turno ${this.numeroTurno} ---\n`);
  }

  agregarJugador(jugador: Jugador) {
    if (jugador.bando === "A") this.bandoA.push(jugador);
    else this.bandoB.push(jugador);

    jugador.conexion.usuario.partida_actial = this;
    jugador.conexion.usuario.jugador_actual = jugador;
    jugador.partida = this;
  }

  ejecutarInicioTurno() {}
}

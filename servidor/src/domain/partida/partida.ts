import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Casilla } from "./casilla";
import { Tablero } from "./tablero";
import { MotorWego } from "./motorWeGo";
import { hacerCamino } from "./camino/hacerCamino";
import { secuenciaTest } from "./camino/secuenciasCamino";
import {
  generadorEfectos,
  TipoEfecto,
} from "./habilidad/efecto/efectosFactory";
import {
  generadorNotificaciones,
  TipoEvento,
} from "./notificaciones/notificacionesFactory";

export class Partida {
  public bandoA: Jugador[] = [];
  public bandoB: Jugador[] = [];
  public fichasEnJuego: Ficha[] = [];
  public tablero: Tablero;
  public motorWego: MotorWego;

  public casillasInicialesPorBando: Record<"A" | "B", Casilla | null> = {
    A: null,
    B: null,
  };

  private numeroTurno = 0;

  private ALTO_MAPA = 7;
  private ANCHO_MAPA = 11;

  private duracion_turno_segundos = 5;
  private intervaloTurno: NodeJS.Timeout | null = null;

  constructor() {
    this.tablero = new Tablero(this.ANCHO_MAPA, this.ALTO_MAPA);
    this.motorWego = new MotorWego(this);
    hacerCamino(secuenciaTest, this.tablero, this);
  }

  getCasillaInicioCamino(bando: "A" | "B"): Casilla | null {
    return this.casillasInicialesPorBando[bando];
  }

  eliminarFicha(ficha: Ficha) {
    const casilla = ficha.casilla;
    if (casilla) {
      casilla.quitarFicha(ficha);
    }

    casilla.jugadoresQueVen.forEach((jugador) => {
      var notificacion =
        generadorNotificaciones[TipoEvento.FICHA_DESTRUIDA](ficha);
      jugador.agregarNotificacion(notificacion);
    });

    const idx = this.fichasEnJuego.indexOf(ficha);
    if (idx >= 0) {
      this.fichasEnJuego.splice(idx, 1);
    }
  }

  ejecutarTurno() {
    this.numeroTurno++;
    console.log(`\n--- Ejecutando turno ${this.numeroTurno} ---`);

    const jugadores = [...this.bandoA, ...this.bandoB];

    /** Inicio */

    for (const jugador of jugadores) {
      generadorEfectos[TipoEfecto.MODIFICAR_ESCENCIA](
        {
          tipo: TipoEfecto.MODIFICAR_ESCENCIA,
          cantidad: 1,
        },
        { jugador, partida: this }
      )();

      const habilidad = jugador.habilidadPendiente;
      if (!habilidad) continue;

      habilidad.ejecutar();
    }

    generadorEfectos[TipoEfecto.DESCONTAR_TODOS_LOS_ENFRIAMIENTOS](
      { tipo: TipoEfecto.DESCONTAR_TODOS_LOS_ENFRIAMIENTOS },
      { partida: this }
    )();

    this.motorWego.procesarFases();

    for (const jugador of jugadores) {
      jugador.enviarNotificaciones();
    }
    console.log(`--- Fin del turno ${this.numeroTurno} ---\n`);
  }

  agregarJugador(jugador: Jugador) {
    if (jugador.bando === "A") this.bandoA.push(jugador);
    else this.bandoB.push(jugador);

    console.log(
      `✅ Jugador ${jugador.conexion.usuario.nombre} se unió a la partida.`
    );
  }

  iniciarPartida() {
    const jugadores = [...this.bandoA, ...this.bandoB];
    // for (const jugador of jugadores) {
    //   jugador.habilidadesPorId.forEach((habilidad) => {
    //     despacharEfecto(
    //       { tipo: TipoEfecto.APLICAR_ENFRIAMIENTO_HABILIDAD, cambio: 1 },
    //       { partida: this, habilidad: habilidad, jugador: jugador }
    //     );
    //   });
    // }
    this.ejecutarTurno();
    this.iniciarCicloTurnos(this.duracion_turno_segundos);
  }

  iniciarCicloTurnos(segundos: number) {
    if (this.intervaloTurno) clearInterval(this.intervaloTurno);

    this.intervaloTurno = setInterval(() => {
      this.ejecutarTurno();
    }, segundos * 1000);

    console.log(`⏳ Ciclo de turnos iniciado: cada ${segundos} segundos.`);
  }
}

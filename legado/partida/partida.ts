import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Casilla } from "../partida2/casilla";

// Tipos de acción posibles de un jugador
export type TipoAccionJugador = "JUGAR_FICHA" | "PASAR" | "HABILIDAD";
export interface AccionJugador {
  jugador: Jugador;
  tipo: TipoAccionJugador;
  [key: string]: any; // o AccionJugadorDatos si preferís más tipado
}

export class Partida {
  public bandoA: Jugador[] = [];
  public bandoB: Jugador[] = [];

  public mapa: Casilla[][] = [];

  private casillaInicialA: Casilla | null = null;
  private casillaInicialB: Casilla | null = null;

  private contadorFichas = 0;
  private numeroTurno = 0;

  constructor(public readonly id: string) {}

  agregarJugador(jugador: Jugador) {
    jugador.accionPendiente = null; // cada jugador puede almacenar su acción
    if (jugador.bando === "A") this.bandoA.push(jugador);
    else this.bandoB.push(jugador);
  }

  comenzar() {
    const ancho = 10;
    const alto = 3;
    for (let y = 0; y < alto; y++) {
      const fila: Casilla[] = [];
      for (let x = 0; x < ancho; x++) {
        fila.push(new Casilla({ x, y }));
      }
      this.mapa.push(fila);
    }

    // Conectar caminos
    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const actual = this.mapa[y][x];
        if (x < ancho - 1)
          actual.setProp("caminoSiguiente", this.mapa[y][x + 1]);
        if (x > 0) actual.setProp("caminoAnterior", this.mapa[y][x - 1]);
      }
    }

    // Casillas iniciales
    const filaCentral = Math.floor(alto / 2);
    this.casillaInicialA = this.mapa[filaCentral][0];
    this.casillaInicialB = this.mapa[filaCentral][ancho - 1];

    console.log(
      `Partida ${this.id} iniciada con ${
        this.bandoA.length + this.bandoB.length
      } jugadores.`
    );
  }

  /** Un jugador selecciona su acción (por ejemplo, jugar una ficha) */
  registrarAccion(jugador: Jugador, accion: AccionJugador) {
    jugador.accionPendiente = accion;
    console.log(
      `Jugador ${jugador.usuario.nombre} (${jugador.bando}) registró acción: ${accion.tipo}`
    );
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

  /** Invoca una ficha en el campo */
  jugarFicha(jugador: Jugador, indiceSet: number) {
    if (!jugador.set || !jugador.set.fichas[indiceSet]) {
      throw new Error("Ficha inválida");
    }

    const fichaBase = jugador.set.fichas[indiceSet];
    const nuevaFicha = new Ficha(this.contadorFichas++, fichaBase, jugador);

    const casillaInicial =
      jugador.bando === "A" ? this.casillaInicialA : this.casillaInicialB;

    casillaInicial.agregarUnidad(nuevaFicha);
    jugador.fichasJugadas.push(nuevaFicha);

    console.log(
      `Jugador ${jugador.usuario.nombre} jugó la ficha ${nuevaFicha.base.nombre} (${jugador.bando})`
    );

    return nuevaFicha;
  }

  /** Devuelve todas las fichas en el campo */
  obtenerTodasLasFichas(): Ficha[] {
    const fichas: Ficha[] = [];
    for (const fila of this.mapa) {
      for (const casilla of fila) {
        const unidades = casilla.obtenerUnidades();
        fichas.push(...unidades);
      }
    }
    return fichas;
  }
}

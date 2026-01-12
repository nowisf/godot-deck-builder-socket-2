import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Evento } from "./evento";
import { Fase } from "./fase";
import { Casilla } from "./casilla";
import { Mapa } from "./mapa";

export type TipoAccionJugador = "JUGAR_FICHA" | "JUGAR_TORRE" | "HABILIDAD";

export interface AccionJugador {
  jugador: Jugador;
  tipo: TipoAccionJugador;
  [key: string]: any;
}

export class Partida {
  public bandoA: Jugador[] = [];
  public bandoB: Jugador[] = [];
  public fichasEnJuego: Ficha[] = [];
  public mapa: Mapa;

  private casillaInicialA: Casilla | null = null;
  private casillaInicialB: Casilla | null = null;

  private accionesPendientes: AccionJugador[] = [];
  constructor(public readonly id: string) {}

  asignarAccion(jugador: Jugador, accion: AccionJugador) {
    const existente = this.accionesPendientes.find(
      (a) => a.jugador === jugador
    );
    if (existente) {
      Object.assign(existente, accion);
    } else {
      this.accionesPendientes.push(accion);
    }
  }

  // ejecutarAccionJugador() {
  //   for (const accion of this.accionesPendientes) {
  //     if (accion.tipo === "JUGAR_FICHA") {
  //       this.jugarFicha(accion.jugador, accion.indiceSet);
  //     }
  //   }
  //   this.accionesPendientes = [];
  // }

  // jugarFicha(jugador: Jugador, indiceSet: number) {
  //   if (!jugador.set || !jugador.set.fichas[indiceSet]) {
  //     throw new Error("Ficha inválida");
  //   }

  //   const fichaBase = jugador.set.fichas[indiceSet];
  //   const nuevaFicha = new Ficha(this.contadorFichas++, fichaBase, jugador);
  //   jugador.fichasEnJuego.push(nuevaFicha);

  //   const casillaInicial =
  //     jugador.bando === "A" ? this.casillaInicialA : this.casillaInicialB;

  //   casillaInicial.agregarUnidad(nuevaFicha);
  //   nuevaFicha.casilla = casillaInicial;

  //   return nuevaFicha;
  // }

  agregarJugador(jugador: Jugador) {
    if (jugador.bando === "A") this.bandoA.push(jugador);
    else this.bandoB.push(jugador);
  }

  ejecutarFase(fase: Fase) {
    console.log(`--- Ejecutando fase: ${fase} ---`);

    if (fase === "INICIO_TURNO") {
      const evento = new Evento("INICIO_TURNO", [
        {
          tipo: "DISMINUIR_CD",
          fase,
          objetivos: this.fichasEnJuego,
        },
      ]);
      evento.ejecutar();
    }

    if (fase === "FIN_TURNO") {
      const evento = new Evento("FIN_TURNO", [
        {
          tipo: "MODIFICAR_STAT",
          fase,
          objetivos: this.fichasEnJuego,
          datos: { stat: "energia", cantidad: 1 },
        },
      ]);
      evento.ejecutar();
    }
  }
}

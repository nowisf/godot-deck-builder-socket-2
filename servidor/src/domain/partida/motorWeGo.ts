import { Ficha } from "@domain/ficha/ficha";
import { Fase } from "./fases/fase";
import { Partida } from "./partida";

import {
  generadorEfectos,
  TipoEfecto,
} from "./habilidad/efecto/efectosFactory";

interface EfectoRetardado {
  efecto: Function;
  fase: Fase;
  turnosRestantes: number; // Contador regresivo
}

export class MotorWego {
  /** Efectos agrupados por fase */

  public fichasQuePodrianMorir = new Set<Ficha>();
  public efectosPorFase: Record<Fase, Function[]> = {
    [Fase.InicioTurno]: [],
    [Fase.MovimientoRapido]: [],
    [Fase.Buffs]: [],
    [Fase.Ataques]: [],
    [Fase.RetirarMuertos]: [],
    [Fase.Invocaciones]: [],
    [Fase.MovimientoNormal]: [],
    [Fase.CambiosVision]: [],
  };

  private efectosPendientes: EfectoRetardado[] = [];

  constructor(public partida: Partida) {}

  /** Agrega un efecto según su fase */
  agregarEfecto(efecto: Function, fase: Fase) {
    if (this.efectosPorFase[fase] === undefined) {
      throw new Error(`Fase inválida: ${fase}`);
    }
    this.efectosPorFase[fase].push(efecto);
  }

  agendarEfectoRetardado(efecto: Function, fase: Fase, turnosEspera: number) {
    if (turnosEspera <= 0) {
      this.agregarEfecto(efecto, fase);
      return;
    }

    this.efectosPendientes.push({
      efecto,
      fase,
      turnosRestantes: turnosEspera,
    });
  }

  private actualizarContadoresDeEfectos() {
    const pendientesSiguientes: EfectoRetardado[] = [];

    for (const pendiente of this.efectosPendientes) {
      pendiente.turnosRestantes--;

      if (pendiente.turnosRestantes <= 0) {
        this.agregarEfecto(pendiente.efecto, pendiente.fase);
      } else {
        pendientesSiguientes.push(pendiente);
      }
    }
    this.efectosPendientes = pendientesSiguientes;
  }

  /** Procesa todas las fases ordenadas */
  procesarFases() {
    this.actualizarContadoresDeEfectos();
    const fasesOrdenadas = Object.values(Fase).filter(
      (v) => typeof v === "number"
    ) as Fase[];
    fasesOrdenadas.sort((a, b) => a - b);

    for (const fase of fasesOrdenadas) {
      for (const efecto of this.efectosPorFase[fase]) {
        efecto();
        console.log(`Efecto ejecutado en fase ${Fase[fase]}.`);
      }

      // Limpiar fase tras procesarla
      this.efectosPorFase[fase] = [];

      if (fase == Fase.RetirarMuertos) {
        this.procesarMuertes();
      }
    }
  }

  private procesarMuertes() {
    for (const ficha of this.fichasQuePodrianMorir) {
      if ((ficha as any).stats.vidaActual <= 0) {
        this.ejecutarMuerte(ficha);
      }
    }

    this.fichasQuePodrianMorir.clear();
  }
  private ejecutarMuerte(ficha: Ficha) {
    console.log(`💀 La ficha ${ficha.id} ha muerto.`);

    this.partida.eliminarFicha(ficha);

    generadorEfectos[TipoEfecto.QUITAR_VISION_EN_RANGO](
      { tipo: TipoEfecto.QUITAR_VISION_EN_RANGO },
      { partida: this.partida, ficha }
    )();
  }
}

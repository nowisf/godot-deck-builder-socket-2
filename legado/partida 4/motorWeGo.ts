import { Efecto } from "./efecto/efecto";
import { ejecutarEfecto } from "./efecto/ejecutadorEfectos";
import { Fase } from "./fases/fase";
import { Partida } from "./partida";

export class MotorWego {
  /** Efectos agrupados por fase */
  public efectosPorFase: Record<Fase, Efecto[]> = {
    [Fase.MovimientoRapido]: [],
    [Fase.Buffs]: [],
    [Fase.Ataques]: [],
    [Fase.RetirarMuertos]: [],
    [Fase.Invocaciones]: [],
    [Fase.MovimientoNormal]: [],
    [Fase.CambiosVision]: [],
  };

  constructor(public partida: Partida) {}

  /** Agrega un efecto según su fase */
  agregarEfecto(ef: Efecto) {
    const fase = ef.fase;
    if (this.efectosPorFase[fase] === undefined) {
      throw new Error(`Fase inválida: ${fase}`);
    }
    this.efectosPorFase[fase].push(ef);
  }

  /** Procesa todas las fases ordenadas */
  procesarFases() {
    const fasesOrdenadas = Object.values(Fase).filter(
      (v) => typeof v === "number"
    ) as Fase[];
    fasesOrdenadas.sort((a, b) => a - b);

    for (const fase of fasesOrdenadas) {
      const lista = this.efectosPorFase[fase];

      for (const efecto of lista) {
        ejecutarEfecto(efecto, this.partida);
      }

      // Limpiar fase tras procesarla
      this.efectosPorFase[fase] = [];
    }
  }
}

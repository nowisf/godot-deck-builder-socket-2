import { FichaBase } from "@domain/ficha/fichaBase";
import { Casilla } from "@domain/partida/casilla";
import { Coords } from "@domain/partida/coords";
import { Habilidad } from "@domain/partida/habilidad/habilidad";
import { Partida } from "@domain/partida/partida";

import { FormaArea } from "@domain/partida/tablero";
import { Jugador } from "@domain/usuario/jugador";

export class Ficha {
  public partida: Partida;
  public casilla: Casilla | null = null;
  public coords: Coords | null = null;
  public stats: Record<string, number> = {};
  //vidaMax
  //vidaActual
  //tiempoReutilizacion
  //enfriamientoInicial
  //distanciaVision
  //exposicion
  public id: string = crypto.randomUUID();

  public formaVision: FormaArea = FormaArea.DIAMANTE;

  public habilidades: Habilidad[] = [];

  public muerta: boolean = false;

  constructor(public base: FichaBase, public amo: Jugador) {
    // Copia stats base
    this.stats = { ...base.stats };
    this.partida = amo.partida;

    if (!this.stats.vidaMax) {
      this.stats.vidaMax = 1;
    }
    this.stats.vidaActual = this.stats.vidaMax;
    if (!this.stats.exposicion) {
      this.stats.exposicion = 1;
    }

    amo.partida.fichasEnJuego.push(this);

    for (const habilidadBase of base.habilidadesBase) {
      const habilidad = habilidadBase.toHabilidad({
        ficha: this,
        tablero: this.partida.tablero,
        partida: this.partida,
      });

      this.habilidades.push(habilidad);
    }
  }
  reducirEnfriamientosHabilidades() {
    this.habilidades.forEach((habilidad) => {
      habilidad.modificarEnfriamiento(-1);
    });
  }
  toJSON() {
    return {
      id: this.id,
      fichaBaseId: this.base.id,
      amo: this.amo,
      stats: this.stats,
    };
  }

  modificarStat(nombre: string, valor: number) {
    if (!this.stats[nombre]) {
      this.stats[nombre] = 0;
    }
    this.stats[nombre] += valor;
  }
  dañar(daño: number) {
    this.stats.vidaActual -= daño;
    if (this.stats.vidaActual < 1) {
      this.partida.motorWego.fichasQuePodrianMorir.add(this);
    }
  }
}

import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Partida } from "./partida";
import { Mapa } from "./mapa";

export class Casilla {
  public unidades: Ficha[] = [];
  public props: Record<string, any> = {};

  /** Máximo rango de visión por jugador en esta casilla */
  public rangoVisionMaxPorJugador: Map<Jugador, number> = new Map();

  /** Casillas desde las cuales cada jugador puede ver esta */
  public casillasConVisionAEstaPorJugador: Map<Jugador, Set<Casilla>> =
    new Map();

  /** referencia a la partida (asignada al crear el mapa) */
  constructor(
    public readonly coordenadas: { x: number; y: number },
    public partmapa: Mapa
  ) {}

  // === Propiedades dinámicas ===
  setProp(nombre: string, valor: any) {
    this.props[nombre] = valor;
  }

  getProp(nombre: string) {
    return this.props[nombre];
  }

  // === Unidades ===
  agregarUnidad(ficha: Ficha) {
    this.unidades.push(ficha);
    this.actualizarVisionPorCambio(ficha, "agregar");
  }

  removerUnidad(ficha: Ficha) {
    const antes = this.unidades.length;
    this.unidades = this.unidades.filter((u) => u !== ficha);

    // Solo recalcula visión si realmente se eliminó algo
    if (this.unidades.length < antes) {
      this.actualizarVisionPorCambio(ficha, "remover");
    }
  }

  obtenerUnidades(): Ficha[] {
    return this.unidades;
  }

  // === Visión ===
  private actualizarVisionPorCambio(ficha: Ficha, tipo: "agregar" | "remover") {
    const jugador = ficha.amo;
    const rangoFicha = ficha.stats.rangoVision ?? 0;
    const rangoActual = this.rangoVisionMaxPorJugador.get(jugador) ?? 0;

    if (tipo === "agregar") {
      if (rangoFicha > rangoActual) {
        this.rangoVisionMaxPorJugador.set(jugador, rangoFicha);
        this.notificarCambioVision(jugador, rangoActual, rangoFicha);
      }
    } else {
      // remover
      if (rangoFicha >= rangoActual) {
        const nuevoRango = Math.max(
          0,
          ...this.unidades
            .filter((u) => u.amo === jugador)
            .map((u) => u.stats.rangoVision ?? 0)
        );
        this.rangoVisionMaxPorJugador.set(jugador, nuevoRango);
        if (nuevoRango < rangoActual) {
          this.notificarCambioVision(jugador, rangoActual, nuevoRango);
        }
      }
    }
  }

  private notificarCambioVision(
    jugador: Jugador,
    rangoAntes: number,
    rangoAhora: number
  ) {
    if (!this.partida) return;
    this.partida.actualizarVisionJugadorDesdeCasilla(
      jugador,
      this,
      rangoAntes,
      rangoAhora
    );
  }

  esVisiblePor(jugador: Jugador): boolean {
    return this.casillasConVisionAEstaPorJugador.has(jugador);
  }
}

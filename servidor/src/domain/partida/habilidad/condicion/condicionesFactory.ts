import { Ficha } from "@domain/ficha/ficha";
import { FormaArea, Tablero } from "../../tablero";
import { Habilidad } from "../habilidad";
import { Jugador } from "@domain/usuario/jugador";

export enum TipoCondicion {
  ENFRIAMIENTO_0 = "ENFRIAMIENTO_0",
  SIN_ENEMIGOS_X_RANGO = "SIN_ENEMIGOS_X_RANGO",
  ESCENCIA_MAYOR_X = "ESCENCIA_MAYOR_X",
  ENEMIGOS_A_X_RANGO = "ENEMIGOS_A_X_RANGO",
}
export type Condicion = () => boolean;

export type CondicionProps =
  | {
      tipo: TipoCondicion.ENFRIAMIENTO_0;
    }
  | {
      tipo: TipoCondicion.ESCENCIA_MAYOR_X;
      cantidad: number;
    }
  | {
      tipo: TipoCondicion.SIN_ENEMIGOS_X_RANGO;
      rango: number;
      forma?: FormaArea;
    }
  | {
      tipo: TipoCondicion.ENEMIGOS_A_X_RANGO;
      rango: number;
      forma?: FormaArea;
    };

export interface CondicionContexto {
  habilidad: Habilidad;
  ficha?: Ficha;
  tablero?: Tablero;
  jugador?: Jugador;
}

type GeneradorCondicion = {
  [TipoCondicion.ENEMIGOS_A_X_RANGO]: (
    props: {
      tipo: TipoCondicion.SIN_ENEMIGOS_X_RANGO;
      rango: number;
      forma?: FormaArea;
    },
    ctx: CondicionContexto
  ) => Condicion;

  [TipoCondicion.ENFRIAMIENTO_0]: (
    props: { tipo: TipoCondicion.ENFRIAMIENTO_0 },
    ctx: CondicionContexto
  ) => Condicion;
  [TipoCondicion.ESCENCIA_MAYOR_X]: (
    props: { tipo: TipoCondicion.ESCENCIA_MAYOR_X; cantidad: number },
    ctx: CondicionContexto
  ) => Condicion;

  [TipoCondicion.SIN_ENEMIGOS_X_RANGO]: (
    props: {
      tipo: TipoCondicion.SIN_ENEMIGOS_X_RANGO;
      rango: number;
      forma?: FormaArea;
    },
    ctx: CondicionContexto
  ) => Condicion;
};

export const generadorCondiciones: GeneradorCondicion = {
  [TipoCondicion.ENEMIGOS_A_X_RANGO]: (props, ctx): Condicion => {
    return () => {
      const forma = props.forma ?? FormaArea.DIAMANTE;
      const fichasEnArea = ctx.tablero.obtenerFichasEnArea(
        ctx.ficha.casilla,
        0,
        props.rango,
        forma
      );

      const enemigos = fichasEnArea.filter(
        (ficha) => ficha !== ctx.ficha && ficha.amo !== ctx.ficha.amo
      );

      return enemigos.length > 0;
    };
  },

  [TipoCondicion.ESCENCIA_MAYOR_X]: (props, ctx) => {
    return () => {
      return props.cantidad <= ctx.jugador.escencia;
    };
  },

  [TipoCondicion.ENFRIAMIENTO_0]: (_props, ctx: CondicionContexto) => {
    return (): boolean => {
      return ctx.habilidad.enfriamientoActual === 0;
    };
  },
  [TipoCondicion.SIN_ENEMIGOS_X_RANGO]: (props, ctx): Condicion => {
    return () => {
      const forma = props.forma ?? FormaArea.DIAMANTE;
      const fichasEnArea = ctx.tablero.obtenerFichasEnArea(
        ctx.ficha.casilla,
        0,
        props.rango,
        forma
      );

      const enemigos = fichasEnArea.filter(
        (ficha) => ficha !== ctx.ficha && ficha.amo !== ctx.ficha.amo
      );

      return enemigos.length === 0;
    };
  },
};

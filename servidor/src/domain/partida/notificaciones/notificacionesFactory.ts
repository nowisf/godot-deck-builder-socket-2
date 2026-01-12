import { Jugador } from "@domain/usuario/jugador";
import { Coords } from "../coords";
import { Ficha } from "@domain/ficha/ficha";

import { Casilla } from "../casilla";
import { FichaMapper } from "src/mappers/ficha.mapper";
import { Habilidad } from "../habilidad/habilidad";
import { TipoAnimacion } from "../habilidad/efecto/efectosFactory";

export type EventoNotificacion = {
  type_evento: TipoEvento;
  [key: string]: unknown;
};

export enum TipoEvento {
  JUGADOR_CAMBIO_ESCENCIA = "jugador_cambio_escencia",
  FICHA_INVOCADA = "ficha_invocada",
  DESCONTAR_TODOS_LOS_ENFRIAMIENTOS = "descontar_todos_los_enfriamientos",
  APLICAR_ENFRIAMIENTO_HABILIDAD = "aplicar_enfriamiento_habilidad",
  DESCUBRIR_BASE_CASILLA = "descubrir_base_casilla",
  VISIBILIDAD_CASILLA = "visibilidad_casilla",
  FICHA_REVELADA = "ficha_revelada",
  SET_HABILIDAD_ID_FICHA_SET_MOSTRADOR = "set_habilidad_id_ficha_set_mostrador",
  FICHA_MOVIDA = "ficha_movida",
  FICHA_DESTRUIDA = "ficha_destruida",
  ACCION_COMBATE = "accion_combate",
}

export interface DetalleImpacto {
  victimaId: string;
  resultados: Array<{ tipo: string; valor: any }>;
}

export const generadorNotificaciones = {
  [TipoEvento.ACCION_COMBATE]: (
    atacante: Ficha,
    animacion: TipoAnimacion,
    impactos: DetalleImpacto[]
  ) => {
    return {
      type_evento: TipoEvento.ACCION_COMBATE,
      atacanteId: atacante.id,
      tipoAnimacion: animacion,
      impactos: impactos,
    } as EventoNotificacion;
  },
  [TipoEvento.FICHA_DESTRUIDA]: (ficha) => {
    return {
      type_evento: TipoEvento.FICHA_DESTRUIDA,

      fichaId: ficha.id,
    } as EventoNotificacion;
  },
  [TipoEvento.FICHA_MOVIDA]: (
    casillaActual: Casilla,
    siguiente: Casilla,
    ficha: Ficha,
    aliada: boolean
  ) => {
    return {
      casillaActual: casillaActual.coords,
      siguiente: siguiente.coords,
      fichaDTO: FichaMapper.toClient(ficha, aliada),
      type_evento: TipoEvento.FICHA_MOVIDA,
    } as EventoNotificacion;
  },
  [TipoEvento.SET_HABILIDAD_ID_FICHA_SET_MOSTRADOR]: (
    fichaBaseId: number,
    habilidadId: String
  ) => {
    return {
      fichaBaseId,
      habilidadId,
      type_evento: TipoEvento.SET_HABILIDAD_ID_FICHA_SET_MOSTRADOR,
    } as EventoNotificacion;
  },
  [TipoEvento.FICHA_REVELADA]: (ficha: Ficha, aliada: boolean) => {
    return {
      type_evento: TipoEvento.FICHA_REVELADA,
      fichaDTO: FichaMapper.toClient(ficha, aliada),
    } as EventoNotificacion;
  },

  [TipoEvento.VISIBILIDAD_CASILLA]: (casilla: Casilla, visible: boolean) => {
    return {
      type_evento: TipoEvento.VISIBILIDAD_CASILLA,
      coords: casilla.coords,
      visible,
    } as EventoNotificacion;
  },
  [TipoEvento.DESCUBRIR_BASE_CASILLA]: (casilla: Casilla) => {
    return {
      type_evento: TipoEvento.DESCUBRIR_BASE_CASILLA,
      coords: casilla.coords,
      nombre_valdosa: casilla.tipoValdosa,
    } as EventoNotificacion;
  },
  //todo revisar jugador en envio
  [TipoEvento.JUGADOR_CAMBIO_ESCENCIA]: (
    jugador: Jugador,
    cambio_escencia: number
  ) => {
    return {
      type_evento: TipoEvento.JUGADOR_CAMBIO_ESCENCIA,
      jugador: jugador,
      cambio_escencia: cambio_escencia,
    } as EventoNotificacion;
  },
  [TipoEvento.FICHA_INVOCADA]: (coords: Coords, ficha: Ficha) => {
    return {
      type_evento: TipoEvento.FICHA_INVOCADA,
      coords: coords,
      ficha_id: ficha,
    } as EventoNotificacion;
  },
  [TipoEvento.DESCONTAR_TODOS_LOS_ENFRIAMIENTOS]: (jugador: Jugador) => {
    return {
      type_evento: TipoEvento.DESCONTAR_TODOS_LOS_ENFRIAMIENTOS,
      jugador: jugador,
    } as EventoNotificacion;
  },
  [TipoEvento.APLICAR_ENFRIAMIENTO_HABILIDAD]: (
    habilidad: Habilidad,
    cambioEnfriamiento: number
  ) => {
    return {
      type_evento: TipoEvento.APLICAR_ENFRIAMIENTO_HABILIDAD,
      habilidad_id: habilidad.id,
      cambio_enfriamiento: cambioEnfriamiento,
    } as EventoNotificacion;
  },
};

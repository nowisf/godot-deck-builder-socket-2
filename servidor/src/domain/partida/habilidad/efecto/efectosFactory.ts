import { Partida } from "../../partida";
import { Jugador } from "@domain/usuario/jugador";
import { Ficha } from "@domain/ficha/ficha";
import { Casilla } from "../../casilla";
import { Fase } from "../../fases/fase";
import {
  generadorNotificaciones,
  TipoEvento,
} from "../../notificaciones/notificacionesFactory";
import { Habilidad } from "../habilidad";
import { FichaBase } from "@domain/ficha/fichaBase";
import { FormaArea } from "@domain/partida/tablero";
import {
  aplicarFiltroPorExposicion,
  aplicarFiltrosObjetivos,
  TipoFiltroObjetivo,
} from "@domain/partida/objetivos/colapsadorObjetivos";
import {
  AlteracionConfig,
  generadorAlteracionFicha,
} from "../alteracionesFichaFactory";

export type Efecto = () => void;

export enum TipoEfecto {
  MODIFICAR_ESCENCIA = "MODIFICAR_ESCENCIA",
  APLICAR_ENFRIAMIENTO_HABILIDAD = "APLICAR_ENFRIAMIENTO_HABILIDAD",
  AGREGAR_FICHA = "AGREGAR_FICHA",
  AGREGAR_VISION_EN_RANGO = "AGREGAR_VISION_EN_RANGO",
  AVANZAR_FICHA = "AVANZAR_FICHA",
  DESCONTAR_TODOS_LOS_ENFRIAMIENTOS = "DESCONTAR_TODOS_LOS_ENFRIAMIENTOS",
  AGREGAR_FICHA_INICIO_CAMINO = "AGREGAR_FICHA_INICIO_CAMINO",
  ELIMINAR_HABILIDAD_PENDIENTE_JUGADOR = "ELIMINAR_HABILIDAD_PENDIENTE_JUGADOR",
  QUITAR_VISION_EN_RANGO = "QUITAR_VISION_EN_RANGO",
  ALTERAR_FICHAS_OBJETIVO = "ALTERAR_FICHAS",
}

export enum TipoAnimacion {
  CHOQUE_MEELE = "CHOQUE_MELEE",
  //etc
}

export type EfectoProps =
  | {
      tipo: TipoEfecto.ALTERAR_FICHAS_OBJETIVO;
      rangoSeleccionObjetivos: number;
      formaSeleccionObjetivos: FormaArea;
      filtrosObjetivos: [TipoFiltroObjetivo];
      cantidadObjetivos: number;
      objetivosReelegibles: boolean;
      alteraciones: [AlteracionConfig];
      tipoAnimacion: TipoAnimacion;
    }
  | { tipo: TipoEfecto.MODIFICAR_ESCENCIA; cantidad: number; fase?: Fase }
  | {
      tipo: TipoEfecto.APLICAR_ENFRIAMIENTO_HABILIDAD;
      cambio: number;
      fase?: Fase;
    }
  | { tipo: TipoEfecto.AGREGAR_FICHA; fase?: Fase; fichaBase: FichaBase }
  | { tipo: TipoEfecto.AVANZAR_FICHA }
  | { tipo: TipoEfecto.DESCONTAR_TODOS_LOS_ENFRIAMIENTOS }
  | {
      tipo: TipoEfecto.AGREGAR_FICHA_INICIO_CAMINO;
      fichaBase: FichaBase;
      fase?: Fase;
    }
  | { tipo: TipoEfecto.AGREGAR_VISION_EN_RANGO; fase?: Fase }
  | { tipo: TipoEfecto.QUITAR_VISION_EN_RANGO }
  | { tipo: TipoEfecto.ELIMINAR_HABILIDAD_PENDIENTE_JUGADOR };

export type GeneradorEfectos = {
  [K in EfectoProps["tipo"]]: (
    props: Extract<EfectoProps, { tipo: K }>,
    ctx: EfectoContextos[K]
  ) => Efecto;
};

export interface EfectoContexto {
  partida: Partida;
  jugador?: Jugador;
  ficha?: Ficha;
  habilidad?: Habilidad;
  casilla?: Casilla;
}

export type EfectoContextos = {
  [TipoEfecto.ALTERAR_FICHAS_OBJETIVO]: {
    ficha: Ficha;
    partida: Partida;
  };

  [TipoEfecto.ELIMINAR_HABILIDAD_PENDIENTE_JUGADOR]: {
    jugador: Jugador;
  };

  [TipoEfecto.MODIFICAR_ESCENCIA]: {
    partida: Partida;
    jugador: Jugador;
  };

  [TipoEfecto.AGREGAR_FICHA_INICIO_CAMINO]: {
    partida: Partida;
    jugador: Jugador;
  };

  [TipoEfecto.APLICAR_ENFRIAMIENTO_HABILIDAD]: {
    partida: Partida;
    habilidad: Habilidad;
    jugador: Jugador;
  };

  [TipoEfecto.AGREGAR_FICHA]: {
    partida: Partida;
    jugador: Jugador;
    casilla: Casilla;
  };

  [TipoEfecto.AGREGAR_VISION_EN_RANGO]: {
    partida: Partida;
    ficha: Ficha;
  };
  [TipoEfecto.QUITAR_VISION_EN_RANGO]: {
    partida: Partida;
    ficha: Ficha;
  };

  [TipoEfecto.AVANZAR_FICHA]: {
    partida: Partida;
    ficha: Ficha;
  };

  [TipoEfecto.DESCONTAR_TODOS_LOS_ENFRIAMIENTOS]: {
    partida: Partida;
  };
};

export const generadorEfectos: GeneradorEfectos = {
  [TipoEfecto.ALTERAR_FICHAS_OBJETIVO]: (props, ctx) => {
    const {
      rangoSeleccionObjetivos,
      formaSeleccionObjetivos,
      filtrosObjetivos,
      cantidadObjetivos,
      objetivosReelegibles,
      alteraciones,
      tipoAnimacion,
    } = props;

    const { ficha, partida } = ctx;
    const tablero = partida.tablero;

    return () => {
      var casillas = tablero.obtenerAro(
        ficha.casilla,
        0,
        rangoSeleccionObjetivos,
        formaSeleccionObjetivos
      );
      casillas = casillas.filter((casilla) =>
        casilla.jugadoresQueVen.has(ficha.amo)
      );
      var objetivos = casillas.flatMap((casilla) => casilla.unidades);
      objetivos = aplicarFiltrosObjetivos(ficha, objetivos, filtrosObjetivos);
      objetivos = aplicarFiltroPorExposicion(
        objetivos,
        cantidadObjetivos,
        objetivosReelegibles
      );

      if (
        !objetivos.every((objetivo) => objetivo.amo === ficha.amo) &&
        ficha.casilla.jugadoresQueVen.size < 2
      ) {
        const objetivoEnemigo = objetivos.find((o) => o.amo !== ficha.amo);

        const posicion = ficha.coords;
        const amo_enemigo = objetivoEnemigo.amo;

        partida.motorWego.agregarEfecto(() => {
          partida.tablero.agregarVisionEnRango(
            posicion,
            0,
            FormaArea.CUADRADO,
            amo_enemigo
          );
        }, Fase.Ataques);

        partida.motorWego.agendarEfectoRetardado(
          () => {
            partida.tablero.quitarVisionEnRango(
              posicion,
              0,
              FormaArea.CUADRADO,
              amo_enemigo
            );
          },
          Fase.InicioTurno,
          1
        );
      }

      var efectos = [];
      const detallesImpactos = [];
      objetivos.forEach((ficha) => {
        const resultados = [];
        alteraciones.forEach((alteracion) => {
          var alteracionResultado = generadorAlteracionFicha[alteracion.tipo]({
            ...alteracion,
            victima: ficha,
          });
          efectos.push(alteracionResultado.ejecucion);
          resultados.push(alteracionResultado.datos);
        });
        detallesImpactos.push({ resultados, victimaId: ficha.id });
      });

      partida.motorWego.agregarEfecto(() => {
        efectos.forEach((efecto) => {
          efecto();
        });
        [...partida.bandoA, ...partida.bandoB].forEach((jugador) => {
          jugador.agregarNotificacion(
            generadorNotificaciones[TipoEvento.ACCION_COMBATE](
              ctx.ficha,
              tipoAnimacion,
              detallesImpactos
            )
          );
        });
      }, Fase.Ataques);
    };
  },

  [TipoEfecto.ELIMINAR_HABILIDAD_PENDIENTE_JUGADOR]: (_props, ctx) => {
    return () => {
      ctx.jugador.partida.motorWego.agregarEfecto(() => {
        ctx.jugador.habilidadPendiente = null;
      }, Fase.InicioTurno);
    };
  },

  [TipoEfecto.MODIFICAR_ESCENCIA]: (props, ctx) => {
    const { jugador, partida } = ctx;
    const fase = props.fase ?? Fase.Invocaciones;

    return () => {
      partida.motorWego.agregarEfecto(() => {
        jugador.escencia += props.cantidad;
        jugador.agregarNotificacion(
          generadorNotificaciones[TipoEvento.JUGADOR_CAMBIO_ESCENCIA](
            jugador,
            props.cantidad
          )
        );
      }, fase);
    };
  },

  [TipoEfecto.APLICAR_ENFRIAMIENTO_HABILIDAD]: (props, ctx) => {
    const { habilidad, partida } = ctx;
    const fase = props.fase ?? Fase.Invocaciones;

    return () => {
      partida.motorWego.agregarEfecto(() => {
        habilidad.modificarEnfriamiento(props.cambio);
      }, fase);
    };
  },

  //agregar_ficha_spawn sin ctx.ficha?
  //los efectos no deben tener ctx ficha?

  //De momento este efecto solo es llamado por otros efectos,
  // no por habilidades
  [TipoEfecto.AGREGAR_FICHA]: (props, ctx) => {
    const { jugador, casilla, partida } = ctx;
    if (!casilla) return;

    const fase = props.fase ?? Fase.Invocaciones;

    return () => {
      const ficha = new Ficha(props.fichaBase, jugador);
      partida.motorWego.agregarEfecto(() => {
        casilla.agregarFicha(ficha);

        casilla.jugadoresQueVen.forEach((jugador) => {
          const aliada = ficha.amo === jugador;
          jugador.agregarNotificacion(
            generadorNotificaciones[TipoEvento.FICHA_REVELADA](ficha, aliada)
          );
        });

        generadorEfectos[TipoEfecto.AGREGAR_VISION_EN_RANGO](
          { tipo: TipoEfecto.AGREGAR_VISION_EN_RANGO },
          { partida, ficha }
        )();
      }, fase);
    };
  },

  [TipoEfecto.AGREGAR_FICHA_INICIO_CAMINO]: (props, ctx) => {
    const { jugador, partida } = ctx;

    const fase = props.fase ?? Fase.Invocaciones;
    const casilla = partida.getCasillaInicioCamino(jugador.bando);

    return () => {
      partida.motorWego.agregarEfecto(() => {
        const ficha = new Ficha(props.fichaBase, jugador);
        casilla.agregarFicha(ficha);

        casilla.jugadoresQueVen.forEach((jugador) => {
          const aliada = ficha.amo === jugador;
          jugador.agregarNotificacion(
            generadorNotificaciones[TipoEvento.FICHA_REVELADA](ficha, aliada)
          );
        });

        generadorEfectos[TipoEfecto.AGREGAR_VISION_EN_RANGO](
          { tipo: TipoEfecto.AGREGAR_VISION_EN_RANGO },
          { partida, ficha }
        )();
      }, fase);
    };
  },

  [TipoEfecto.AGREGAR_VISION_EN_RANGO]: (props, ctx) => {
    const { ficha, partida } = ctx;
    const fase = props.fase ?? Fase.CambiosVision;

    const coords = ficha.coords;
    const rango = ficha.stats.distanciaVision;
    const forma = ficha.formaVision;
    const amo = ficha.amo;

    return () => {
      partida.motorWego.agregarEfecto(() => {
        partida.tablero.agregarVisionEnRango(coords, rango, forma, amo);
      }, fase);
    };
  },
  [TipoEfecto.QUITAR_VISION_EN_RANGO]: (_props, ctx) => {
    const { ficha, partida } = ctx;

    const coords = ficha.coords;
    const rango = ficha.stats.distanciaVision;
    const forma = ficha.formaVision;
    const amo = ficha.amo;

    return () => {
      partida.motorWego.agregarEfecto(() => {
        partida.tablero.quitarVisionEnRango(coords, rango, forma, amo);
      }, Fase.CambiosVision);
    };
  },

  [TipoEfecto.AVANZAR_FICHA]: (_props, ctx) => {
    const { ficha, partida } = ctx;
    return () => {
      partida.motorWego.agregarEfecto(() => {
        if (ficha.muerta) {
          return;
        }

        if (!partida.tablero.puedeAvanzar(ficha)) {
          return;
          //Aqui va la victoria?
        }
        const efectoQuitarVicion = generadorEfectos[
          TipoEfecto.QUITAR_VISION_EN_RANGO
        ]({ tipo: TipoEfecto.QUITAR_VISION_EN_RANGO }, { partida, ficha });

        const resultado = partida.tablero.avanzarFicha(ficha);

        if (!resultado) return;

        const { casillaActual, siguiente } = resultado;

        [
          ...new Set([
            ...casillaActual.jugadoresQueVen,
            ...siguiente.jugadoresQueVen,
          ]),
        ].forEach((jugador) => {
          if (!casillaActual.esVisiblePara(jugador)) {
            jugador.agregarNotificacion(
              generadorNotificaciones[TipoEvento.FICHA_REVELADA](
                ficha,
                jugador === ficha.amo
              )
            );
          }

          jugador.agregarNotificacion(
            generadorNotificaciones[TipoEvento.FICHA_MOVIDA](
              casillaActual,
              siguiente,
              ficha,
              jugador === ficha.amo
            )
          );
        });
        generadorEfectos[TipoEfecto.AGREGAR_VISION_EN_RANGO](
          { tipo: TipoEfecto.AGREGAR_VISION_EN_RANGO },
          { partida, ficha }
        )();
        efectoQuitarVicion();
      }, Fase.MovimientoNormal);
    };
  },

  [TipoEfecto.DESCONTAR_TODOS_LOS_ENFRIAMIENTOS]: (_props, ctx) => {
    const partida = ctx.partida;

    return () => {
      partida.motorWego.agregarEfecto(() => {
        [
          ...partida.bandoA,
          ...partida.bandoB,
          ...partida.fichasEnJuego,
        ].forEach((habilidoso) => {
          habilidoso.reducirEnfriamientosHabilidades();
        });
      }, Fase.InicioTurno);
    };
  },
};

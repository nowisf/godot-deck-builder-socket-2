import { Jugador } from "@domain/usuario/jugador";
import { FichaBase } from "@domain/ficha/fichaBase";

import { Ficha } from "@domain/ficha/ficha";

import { generadorEfectos, TipoEfecto } from "./efecto/efectosFactory";
import { Habilidad } from "@domain/partida/habilidad/habilidad";
import {
  generadorCondiciones,
  TipoCondicion,
} from "@domain/partida/habilidad/condicion/condicionesFactory";

/* -----------------------------------------
                JUGAR FICHA 
  Accion de Jugador para jugar una ficha.
  Ejecutada pre WEGO

  Añade los siguientes efectos a WEGO:
    1) descuento de escencia segun coste ficha
    2) invocar la ficha en el extremo del camino correspondinte
    3) aplicar el enfriamiento de jugador
    4) aplicar el enfriamiento de ficha_mano
    5) retira la intencion del jugador

    -) aplicar efectos al jugar ficha (si los tiene)
----------------------------------------- */

export function GenerarHabilidadJugarFichaSiPuede(
  jugador: Jugador,
  fichaBase: FichaBase
): Habilidad {
  const habilidad = new Habilidad(
    jugador,
    fichaBase.tiempoReutilizacion,
    fichaBase.enfriamientoInicial,
    [],
    [],
    `Invocar ${fichaBase.nombre}`
  );
  habilidad.agregarCondicion(
    generadorCondiciones[TipoCondicion.ESCENCIA_MAYOR_X](
      { tipo: TipoCondicion.ESCENCIA_MAYOR_X, cantidad: fichaBase.coste },
      { jugador, habilidad }
    )
  );
  habilidad.agregarCondicion(
    generadorCondiciones[TipoCondicion.ENFRIAMIENTO_0](
      { tipo: TipoCondicion.ENFRIAMIENTO_0 },
      { habilidad }
    )
  );

  habilidad.agregarEfecto(
    generadorEfectos[TipoEfecto.MODIFICAR_ESCENCIA](
      {
        tipo: TipoEfecto.MODIFICAR_ESCENCIA,
        cantidad: -fichaBase.coste,
      },
      { jugador, partida: jugador.partida }
    )
  );
  habilidad.agregarEfecto(
    generadorEfectos[TipoEfecto.ELIMINAR_HABILIDAD_PENDIENTE_JUGADOR](
      { tipo: TipoEfecto.ELIMINAR_HABILIDAD_PENDIENTE_JUGADOR },
      { jugador }
    )
  );

  habilidad.agregarEfecto(
    generadorEfectos[TipoEfecto.APLICAR_ENFRIAMIENTO_HABILIDAD](
      {
        tipo: TipoEfecto.APLICAR_ENFRIAMIENTO_HABILIDAD,
        cambio: fichaBase.tiempoReutilizacion,
      },
      { partida: jugador.partida, habilidad, jugador }
    )
  );
  habilidad.agregarEfecto(
    generadorEfectos[TipoEfecto.AGREGAR_FICHA_INICIO_CAMINO](
      { tipo: TipoEfecto.AGREGAR_FICHA_INICIO_CAMINO, fichaBase },
      { partida: jugador.partida, jugador }
    )
  );

  return habilidad;
}
/* -----------------------------------------
                E F E C T O S
----------------------------------------- */

import { Evento } from "./evento";
import { Efecto } from "./efectos/efecto";
import { seleccionarObjetivos } from "./objetivos";
import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Fase } from "./fase";

/**
 * Carga un evento desde una definición JSON.
 * - Reemplaza los tipos de objetivos por objetos reales.
 * - Usa `origen` como referencia (puede ser una ficha o jugador).
 */
export function cargarEventoDesdeJSON(
  data: any,
  todasLasFichas: Ficha[],
  origen: Ficha | Jugador
): Evento {
  const fase = data.fase as Fase;

  const efectos: Efecto[] = data.efectos.map((ef: any) => {
    const objetivos = seleccionarObjetivos(
      ef.objetivos,
      todasLasFichas,
      origen
    );

    return {
      tipo: ef.tipo,
      fase,
      objetivos,
      datos: ef.datos || {},
    };
  });

  return new Evento(fase, efectos);
}

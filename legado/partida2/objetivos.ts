import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";

/**
 * Tipos posibles de objetivos que pueden definirse en efectos.
 * Se pueden ampliar según las necesidades del juego.
 */
export type TipoObjetivo =
  | "TODAS"
  | "ALIADAS"
  | "ENEMIGAS"
  | "PROPIA"
  | "CAMINO"
  | "CASILLA";

/**
 * Selecciona los objetivos de un efecto según su tipo.
 *
 * @param tipoObjetivo - El tipo de objetivo definido en el efecto.
 * @param todasLasFichas - Todas las fichas activas en la partida.
 * @param origen - Quién lanza el efecto (Ficha o Jugador).
 * @returns Un array con las fichas objetivo.
 */
export function seleccionarObjetivos(
  tipoObjetivo: TipoObjetivo | TipoObjetivo[],
  todasLasFichas: Ficha[],
  origen: Ficha | Jugador
): Ficha[] {
  const tipos = Array.isArray(tipoObjetivo) ? tipoObjetivo : [tipoObjetivo];

  let objetivos: Ficha[] = [];

  for (const tipo of tipos) {
    switch (tipo) {
      case "TODAS":
        objetivos.push(...todasLasFichas);
        break;

      case "ALIADAS":
        if ("amo" in origen) {
          // origen es una ficha
          objetivos.push(
            ...todasLasFichas.filter(
              (f) => f.amo === origen.amo && f !== origen
            )
          );
        } else {
          // origen es un jugador
          objetivos.push(...todasLasFichas.filter((f) => f.amo === origen));
        }
        break;

      case "ENEMIGAS":
        if ("amo" in origen) {
          objetivos.push(...todasLasFichas.filter((f) => f.amo !== origen.amo));
        } else {
          objetivos.push(...todasLasFichas.filter((f) => f.amo !== origen));
        }
        break;

      case "PROPIA":
        if ("amo" in origen) {
          objetivos.push(origen);
        }
        break;

      case "CAMINO":
        if ("amo" in origen && origen.casilla) {
          // Devuelve todas las fichas en el mismo camino
          const camino = recorrerCaminoDesde(origen.casilla);
          const fichasEnCamino = todasLasFichas.filter((f) =>
            camino.includes(f.casilla)
          );
          objetivos.push(...fichasEnCamino);
        }
        break;

      default:
        console.warn("Tipo de objetivo desconocido:", tipo);
        break;
    }
  }

  // Evita duplicados
  return Array.from(new Set(objetivos));
}

/**
 * Recorre las casillas desde una inicial siguiendo sus "caminoSiguiente".
 */
function recorrerCaminoDesde(casilla: any): any[] {
  const recorrido: any[] = [];
  let actual = casilla;

  while (actual) {
    recorrido.push(actual);
    actual = actual.caminoSiguiente;
  }

  return recorrido;
}

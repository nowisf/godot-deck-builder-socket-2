import { Ficha } from "@domain/ficha/ficha";
import {
  FiltroObjetivo,
  ReglaPosoObjetivo,
  ReglasObjetivo,
} from "./reglasObjetivo";
import { Jugador } from "@domain/usuario/jugador";
import { FormaArea, Tablero } from "../tablero";

// 🔥 Función principal
export function colapsarObjetivos(
  origen: Ficha,
  todas: Ficha[],
  tablero: Tablero,
  reglas: ReglasObjetivo
): (Ficha | Jugador)[] {
  if (!reglas) return [];

  // 1️⃣ POSO DE OBJETIVOS
  let resultado: (Ficha | Jugador)[] = aplicarReglasPoso(
    origen,
    tablero,
    todas,
    reglas.reglasPoso ?? []
  );

  // 2️⃣ FILTROS
  resultado = aplicarFiltrosObjetivos(
    origen,
    resultado,
    reglas.filtrosObjetivo ?? []
  );

  // 3️⃣ SELECTOR POR CANTIDAD
  if (reglas.cantidadObjetivos && resultado.length > reglas.cantidadObjetivos) {
    resultado = resultado.slice(0, reglas.cantidadObjetivos);
  }

  return resultado;
}

function aplicarReglasPoso(
  origen: Ficha,
  tablero: Tablero,
  todas: Ficha[],
  reglas: ReglaPosoObjetivo[]
): (Ficha | Jugador)[] {
  if (reglas.length === 0) return [];

  let acumulado: (Ficha | Jugador)[] = [];

  for (const regla of reglas) {
    switch (regla.tipo) {
      case "AMO":
        if ("amo" in origen) {
          acumulado.push(origen.amo);
        }
        break;

      case "TODA_FICHA":
        acumulado.push(...todas);
        break;

      case "FICHAS_EN_AREA": {
        const {
          rangoMin = 0,
          rangoMax,
          forma = "diamante",
        } = regla.props as {
          rangoMin?: number;
          rangoMax: number;
          forma?: FormaArea;
        };

        const centroCasilla = tablero.getCasilla(origen.coords);
        if (!centroCasilla) break;

        const fichas = tablero.obtenerFichasEnArea(
          centroCasilla,
          rangoMin,
          rangoMax,
          forma
        );

        acumulado.push(...fichas);
        break;
      }
    }
  }

  // Evita duplicados
  return Array.from(new Set(acumulado));
}

export enum TipoFiltroObjetivo {
  ALIADOS = "ALIADOS",
  ENEMIGOS = "ENEMIGOS",
  HERIDOS = "HERIDOS",
  //etc
}
export function aplicarFiltrosObjetivos(
  origen: Ficha,
  objetivos: Ficha[],
  filtros: TipoFiltroObjetivo[]
) {
  let resultado = objetivos;

  for (const filtro of filtros) {
    switch (filtro) {
      case "ALIADOS":
        resultado = resultado.filter((f) => f.amo === origen.amo);
        break;

      case "ENEMIGOS":
        resultado = resultado.filter((f) => f.amo !== origen.amo);
        break;

      case "HERIDOS":
        resultado = resultado.filter(
          (f) => f.stats.vidaActual < f.stats.vidaMax
        );
        break;
    }
  }

  return resultado;
}

export function aplicarFiltroPorExposicion(
  candidatos: Ficha[],
  cantidad: number,
  reElegible: boolean
): Ficha[] {
  const pool = candidatos.filter((f) => (f.stats?.exposicion ?? 0) > 0);

  const seleccionados: Ficha[] = [];

  for (let i = 0; i < cantidad; i++) {
    if (pool.length === 0) break;

    const totalExposicion = pool.reduce(
      (sum, f) => sum + f.stats.exposicion,
      0
    );

    let ruleta = Math.random() * totalExposicion;

    let ganador: Ficha | null = null;

    for (let j = 0; j < pool.length; j++) {
      const ficha = pool[j];
      ruleta -= ficha.stats.exposicion;

      if (ruleta <= 0) {
        ganador = ficha;

        if (!reElegible) {
          pool.splice(j, 1);
        }
        break;
      }
    }

    if (ganador) {
      seleccionados.push(ganador);
    }
  }

  return seleccionados;
}

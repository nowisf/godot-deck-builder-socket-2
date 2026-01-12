import { Ficha } from "@domain/ficha/ficha";
import {
  FiltroObjetivo,
  ReglaPosoObjetivo,
  ReglasObjetivo,
} from "./reglasObjetivo";
import { Jugador } from "@domain/usuario/jugador";
import { Tablero } from "../tablero";

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
  resultado = aplicarFiltros(origen, resultado, reglas.filtrosObjetivo ?? []);

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
          forma?: "diamante" | "cuadrado";
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

function aplicarFiltros(
  origen: Ficha,
  objetivos: (Ficha | Jugador)[],
  filtros: FiltroObjetivo[]
) {
  let resultado = objetivos;

  for (const filtro of filtros) {
    switch (filtro.tipo) {
      case "ALIADOS":
        resultado = resultado.filter((f) => {
          tieneAmo(f) && tieneAmo(origen) && f.amo === origen.amo;
        });
        break;

      case "ENEMIGOS":
        resultado = resultado.filter(
          (f) => tieneAmo(f) && tieneAmo(origen) && f.amo !== origen.amo
        );
        break;

      case "HERIDOS":
        resultado = resultado.filter(
          (f) => tieneAmo(f) && f.vidaActual < f.vidaMax
        );
        break;
    }
  }

  return resultado;
}

function tieneAmo(x: Ficha | Jugador): x is Ficha {
  return typeof x === "object" && x !== null && "amo" in x;
}

/* ------------------------------------------
| NO TERMINADO | NO DEFINIDO | NO ASICALADO | 
  ----------------------------------------- */
import { Efecto } from "./efecto";
import { Coords } from "../coords";
import { Jugador } from "@domain/usuario/jugador";
import { Ficha } from "@domain/ficha/ficha";
import { FormaArea } from "../tablero";

export const EF = {
  /* ---------------------------------------
     EFECTO: DAÑAR
  --------------------------------------- */
  dañar(objetivo: Ficha, daño: number): Efecto {
    return {
      tipo: "DAÑAR",
      origen: null,
      objetivo,
      props: { daño },
    };
  },

  /* ---------------------------------------
     EFECTO: AVANZAR
  --------------------------------------- */
  avanzar(ficha: Ficha): Efecto {
    return {
      tipo: "AVANZAR",
      origen: ficha,
      objetivo: null,
      props: {},
    };
  },

  /* ---------------------------------------
     EFECTO: AGREGAR VISIÓN
  --------------------------------------- */
  agregarVision(
    pos: Coords,
    distancia: number,
    jugador: Jugador,
    forma: FormaArea = "diamante"
  ): Efecto {
    return {
      tipo: "AGREGAR_VISION",
      origen: jugador,
      objetivo: null,
      props: { pos, distancia, forma, jugador },
    };
  },

  /* ---------------------------------------
     EFECTO: QUITAR VISIÓN
  --------------------------------------- */
  quitarVision(
    pos: Coords,
    distancia: number,
    jugador: Jugador,
    forma: FormaArea = "diamante"
  ): Efecto {
    return {
      tipo: "QUITAR_VISION",
      origen: jugador,
      objetivo: null,
      props: { pos, distancia, forma, jugador },
    };
  },

  /* ---------------------------------------
     EFECTO: AGREGAR FICHA AL TABLERO
  --------------------------------------- */
  agregarFicha(ficha: Ficha, pos: Coords): Efecto {
    return {
      tipo: "AGREGAR_FICHA",
      origen: ficha,
      objetivo: null,
      props: { ficha, posicion: pos },
    };
  },

  /* ---------------------------------------
     EFECTO: QUITAR FICHA DEL TABLERO
  --------------------------------------- */
  quitarFicha(ficha: Ficha): Efecto {
    return {
      tipo: "QUITAR_FICHA",
      origen: ficha,
      objetivo: null,
      props: { ficha },
    };
  },
};

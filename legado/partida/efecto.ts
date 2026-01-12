import { Ficha } from "@domain/ficha/ficha";
import { Casilla } from "../partida2/casilla";
import { Jugador } from "@domain/usuario/jugador";

export interface EfectoObjetivo {
  origen: Ficha;
  objetivo: Ficha | Casilla | Jugador | FichaSet;
  tipo: "ATAQUE_BASE" | "INVOCAR" | "DEBUFF";
  valor: number;
}
export interface Evento {
  origen: Ficha;
  objetivo: Ficha | Casilla | Jugador | FichaSet;
  tipo: "ATAQUE_BASE" | "INVOCAR" | "DEBUFF";
  fase:
    | "DOTS"
    | "CDS"
    | "INVOCACIONES"
    | "MUERTES"
    | "POSTMUERTE"
    | "MOVIMIENTO";
  valor: number;
}

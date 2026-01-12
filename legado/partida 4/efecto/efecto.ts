import { Ficha } from "@domain/ficha/ficha";
import { Fase } from "../fases/fase";
import { Jugador } from "@domain/usuario/jugador";

export type Efecto = {
  fase: Fase;
  objetivo: Ficha | Jugador | null;
  origen: Ficha | Jugador | null;
  props: Record<string, unknown>;
  tipo: string;
};

import { Fase } from "../../fases/fase";
import { ReglasObjetivo } from "../../objetivos/reglasObjetivo";

//dato usado para generar efectos,
// el preEfecto resulta en efectos variables
// el efecto resulta en procesos concretos

// un preEfecto puede encadenar preEfectos en su misma fase
export type preEfecto = {
  reglaObjetico: ReglasObjetivo | null;
  tipo: String;
  fase: Fase;
  props: Record<string, unknown>;
};

//1ro poso de objetivos
//2do filtros de objetivos
//3ro selectores por exposicion a la cantidad

export interface ReglasObjetivo {
  reglasPoso?: ReglaPosoObjetivo[];
  filtrosObjetivo?: FiltroObjetivo[];
  cantidadObjetivos?: number;
}

export type ReglaPosoObjetivo = {
  tipo: "AMO" | "TODA_FICHA" | "FICHAS_EN_AREA";
  props: Record<string, unknown>;
};

export type FiltroObjetivo = {
  tipo: "ALIADOS" | "ENEMIGOS" | "HERIDOS";
  props: Record<string, unknown>;
};

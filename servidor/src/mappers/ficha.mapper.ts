import { Ficha } from "@domain/ficha/ficha";
import { FichaBase } from "@domain/ficha/fichaBase";
import { Coords } from "@domain/partida/coords";

export interface FichaDTO {
  id: string;
  stats: Record<string, number>;
  ficha_base_id: number;
  aliada: boolean;
  coords: Coords;
}

export class FichaMapper {
  static toClient(ficha: Ficha, aliada: boolean): FichaDTO {
    return {
      id: ficha.id,
      stats: ficha.stats,
      ficha_base_id: ficha.base.id,
      aliada: aliada,
      coords: ficha.coords,
    };
  }
}

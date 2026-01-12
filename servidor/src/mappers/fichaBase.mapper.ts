// src/mappers/ficha.mapper.ts
import { FichaBase } from "@domain/ficha/fichaBase";
import { FichaObject } from "src/data/fichas";
import { HabilidadBaseDTO, HabilidadBaseMapper } from "./habilidadBase.mapper";

export interface FichaBaseDTO {
  id: number;
  nombre: string;
  imagenFicha: string;
  imagenSet: string;
  coste: number;
  stats: Record<string, number>;
  habilidades: HabilidadBaseDTO[];
}

export class FichaBaseMapper {
  static fromJson(id: string, data: FichaObject): FichaBase {
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      throw new Error(`ID de ficha inválido: ${id}`);
    }
    const habilidadesBase = (data.habilidades ?? []).map(
      HabilidadBaseMapper.fromJson
    );

    return new FichaBase(
      numericId,
      data.nombre,
      data.imagenFicha,
      data.imagenSet,
      data.stats,
      habilidadesBase
    );
  }
  static toClient(ficha: FichaBase): FichaBaseDTO {
    return {
      id: ficha.id,
      nombre: ficha.nombre,
      imagenFicha: ficha.imagenFicha,
      imagenSet: ficha.imagenSet,
      coste: ficha.coste,
      stats: ficha.stats,
      habilidades: ficha.habilidadesBase.map((habilidad) =>
        HabilidadBaseMapper.toClient(habilidad)
      ),
    };
  }
}

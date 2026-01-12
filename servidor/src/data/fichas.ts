import { FichaBase } from "@domain/ficha/fichaBase";

import fs from "fs";
import path from "path";
import { FichaBaseMapper } from "src/mappers/fichaBase.mapper";
import { HabilidadBaseJSON } from "src/mappers/habilidadBase.mapper";

export interface FichaObject {
  nombre: string;
  imagenFicha: string;
  imagenSet: string;
  coste: number;
  stats: Record<string, number>;
  habilidades?: HabilidadBaseJSON[];
}

export type FichasJson = Record<string, FichaObject>;

class FichasManager {
  private fichasObject: FichasJson = {};
  private filePath: string;
  private fichas: Map<number, FichaBase> = new Map();

  constructor(fileName = "fichas.json") {
    this.filePath = path.join(process.cwd(), "src", "data", fileName);
    this.cargarFichas();

    fs.watch(this.filePath, (eventType) => {
      if (eventType === "change") {
        console.log("♻️ fichas.json actualizado, recargando...");
        this.cargarFichas();
      }
    });
  }

  private cargarFichas() {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    this.fichasObject = JSON.parse(raw);

    this.fichas.clear();

    for (const [id, fichaData] of Object.entries(this.fichasObject)) {
      const ficha = FichaBaseMapper.fromJson(id, fichaData);
      this.fichas.set(ficha.id, ficha);
    }
  }

  getTodasCliente() {
    return Array.from(this.fichas.values()).map((ficha) =>
      FichaBaseMapper.toClient(ficha)
    );
  }

  getFicha(id: number): FichaBase | undefined {
    return this.fichas.get(id);
  }
}

export const fichasManager = new FichasManager();

import { FichaBase } from "@domain/ficha/fichaBase";
import fs from "fs";
import path from "path";

export interface FichaObject {
  nombre: string;
  imagenFicha: string;
  imagenSet: string;
  coste: number;
}

export type FichasJson = Record<string, FichaObject>;

class FichasManager {
  private fichasObject: FichasJson = {};
  private filePath: string;
  private fichas: Map<string, FichaBase> = new Map();

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

    for (const [id, fichaData] of Object.entries(this.fichasObject)) {
      const ficha = new FichaBase(
        id,
        fichaData.nombre,
        fichaData.imagenFicha,
        fichaData.imagenSet,
        fichaData.coste
      );
      this.fichas.set(id, ficha);
    }
  }

  getTodasJson(): FichasJson {
    return this.fichasObject;
  }

  getFicha(id: string | number): FichaBase | undefined {
    return this.fichas.get(String(id));
  }
}

export const fichasManager = new FichasManager();

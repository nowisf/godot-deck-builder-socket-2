import fs from "fs";
import path from "path";

export interface Config {
  fichasBienvenida: number[];
  version: string;
}

class ConfigManager {
  private config: Config;
  private filePath: string;

  constructor(fileName = "config.json") {
    this.filePath = path.join(process.cwd(), "src", "data", fileName);
    this.config = this.cargarConfig();

    fs.watch(this.filePath, (eventType) => {
      if (eventType === "change") {
        console.log("config.json actualizado, recargando...");
        this.config = this.cargarConfig();
      }
    });
  }

  private cargarConfig(): Config {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(raw);
  }

  getFichasBienvenida(): number[] {
    return this.config.fichasBienvenida;
  }
  getVersion(): string {
    return this.config.version;
  }
}

export const configManager = new ConfigManager();

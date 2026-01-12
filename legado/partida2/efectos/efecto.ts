import { Ficha } from "@domain/ficha/ficha";

export interface Efecto {
  id?: string;
  tipo: string; // nombre del efecto (ej. "MODIFICAR_STAT", "DISMINUIR_CD")
  fase: string;
  objetivos: Ficha[];
  datos?: Record<string, any>;
}

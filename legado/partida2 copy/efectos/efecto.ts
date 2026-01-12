import { Ficha } from "@domain/ficha/ficha";
//se aplica al ejecutador de efectos y returna el ejecutable para el efecto
export interface Efecto {
  id?: string;
  tipo: string; // nombre del efecto (ej. "MODIFICAR_STAT", "DISMINUIR_CD")
  fase: string;
  objetivos: Objetivo[];
  datos?: Record<string, any>;
}

import { Efecto } from "../efecto";
import { Ficha } from "@domain/ficha/ficha";

/**
 * Disminuye el cooldown de las habilidades o de la ficha misma.
 * Props esperados:
 * - cantidad: number (opcional, por defecto 1)
 */
export const disminuirCD = (efecto: Efecto) => {
  const cantidad = efecto.datos.cantidad ?? 1;

  for (const objetivo of efecto.objetivos) {
    // Si el objetivo tiene habilidades con cooldown
    if ((objetivo as any).habilidades) {
      for (const habilidad of (objetivo as any).habilidades) {
        if (habilidad.cdActual && habilidad.cdActual > 0) {
          habilidad.cdActual = Math.max(0, habilidad.cdActual - cantidad);
        }
      }
    }

    // Si el objetivo tiene un cooldown general
    if ((objetivo as any).cdActual !== undefined) {
      (objetivo as any).cdActual = Math.max(
        0,
        (objetivo as any).cdActual - cantidad
      );
    }
  }

  console.log(
    `🧊 Efecto: DISMINUIR_CD aplicado a ${efecto.objetivos.length} objetivos (-${cantidad})`
  );
};

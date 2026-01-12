import { Efecto } from "../efecto";

/**
 * Modifica un stat en los objetivos. Si el stat no existe, se crea.
 * Props esperados:
 * - stat: string (nombre del stat)
 * - cantidad: number
 * - operacion: "sumar" | "multiplicar" (por defecto "sumar")
 */
export const modificarStat = (efecto: Efecto) => {
  const stat = efecto.datos.stat;
  const cantidad = efecto.datos.cantidad ?? 0;
  const operacion = efecto.datos.operacion ?? "sumar";

  if (!stat) {
    console.warn("⚠️ Efecto MODIFICAR_STAT sin 'stat' definido.");
    return;
  }

  for (const objetivo of efecto.objetivos) {
    // Si el objetivo no tiene el stat, se crea
    if ((objetivo as any)[stat] === undefined) {
      (objetivo as any)[stat] = 0;
    }

    switch (operacion) {
      case "sumar":
        (objetivo as any)[stat] += cantidad;
        break;

      case "multiplicar":
        (objetivo as any)[stat] *= cantidad;
        break;

      default:
        console.warn(`Operación desconocida en MODIFICAR_STAT: ${operacion}`);
    }

    console.log(
      `📊 Efecto: MODIFICAR_STAT (${operacion} ${cantidad}) aplicado a ${stat} de ${objetivo.constructor.name}`
    );
  }
};

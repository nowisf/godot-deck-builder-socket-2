import { registrarEfecto } from "./registradorEfectos";

import { modificarStat } from "./efectos/modificar_stat";
import { disminuirCD } from "./efectos/disminuir_cd";

/**
 * Carga y registra todos los efectos estándar del juego.
 * Se puede llamar al iniciar el servidor o al crear la primera partida.
 */
export function cargarEfectos() {
  console.log("🧩 Cargando efectos base...");

  registrarEfecto("DISMINUIR_CD", disminuirCD);
  registrarEfecto("MODIFICAR_STAT", modificarStat);

  console.log("✅ Efectos cargados correctamente.");
}

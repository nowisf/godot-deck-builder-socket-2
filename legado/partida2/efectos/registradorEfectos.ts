import { Efecto } from "./efecto";

// 🔹 Mapa de funciones registradas
const efectosRegistrados: Record<string, (efecto: Efecto) => void> = {};

/** Registra un nuevo tipo de efecto */
export function registrarEfecto(
  nombre: string,
  ejecutor: (efecto: Efecto) => void
) {
  efectosRegistrados[nombre] = ejecutor;
}

/** Ejecuta un efecto según su tipo */
export function ejecutarEfecto(efecto: Efecto) {
  const ejecutor = efectosRegistrados[efecto.tipo];
  if (!ejecutor) {
    console.warn(`❗ Efecto no registrado: ${efecto.tipo}`);
    return;
  }
  ejecutor(efecto);
}

/** Devuelve todos los efectos actualmente registrados */
export function listarEfectos() {
  return Object.keys(efectosRegistrados);
}

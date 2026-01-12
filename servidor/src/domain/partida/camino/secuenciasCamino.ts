import { Coords } from "../coords";
const secuenciaTest: Coords[] = [
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 7, y: 1 },
  { x: 8, y: 1 },
  { x: 8, y: 2 },
  { x: 8, y: 3 },
  { x: 7, y: 3 },
  { x: 6, y: 3 },

  { x: 5, y: 3 },

  { x: 4, y: 3 },
  { x: 3, y: 3 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 2, y: 5 },
  { x: 3, y: 5 },
  { x: 4, y: 5 },
  { x: 5, y: 5 },
  { x: 6, y: 5 },
];

const secuenciaTest2: Coords[] = [
  // --- Fila Superior (y=1) ---
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },

  // --- Baja ---
  { x: 5, y: 2 },
  { x: 5, y: 3 },
  { x: 5, y: 4 },

  // --- Vuelve a la izquierda (y=4) ---
  { x: 4, y: 4 },
  { x: 3, y: 4 },
  { x: 2, y: 4 },
  { x: 1, y: 4 },

  // --- Baja ---
  { x: 1, y: 5 },
  { x: 1, y: 6 },
  { x: 1, y: 7 },

  // --- Vuelve a la derecha (y=7) ---
  { x: 2, y: 7 },
  { x: 3, y: 7 },
  { x: 4, y: 7 },
  { x: 5, y: 7 },

  // --- Baja final ---
  { x: 5, y: 8 },
  { x: 5, y: 9 },

  // --- Meta (y=9) ---
  { x: 4, y: 9 },
  { x: 3, y: 9 },
  { x: 2, y: 9 },
];

export { secuenciaTest };

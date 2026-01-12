import { NombresValdosas, PropCasilla } from "../casilla";
import { Coords } from "../coords";
import { Partida } from "../partida";
import { Tablero } from "../tablero";

export function hacerCamino(
  secuencia: Coords[],
  tablero: Tablero,
  partida: Partida
) {
  for (let i = 0; i < secuencia.length; i++) {
    const coordsActual = secuencia[i];
    const casillaActual = tablero.getCasilla(coordsActual);

    if (!casillaActual) continue;

    casillaActual.tipoValdosa = NombresValdosas.PASTO_CAMINO;

    const anterior = i > 0 ? tablero.getCasilla(secuencia[i - 1]) : null;
    const siguiente =
      i < secuencia.length - 1 ? tablero.getCasilla(secuencia[i + 1]) : null;

    if (anterior)
      casillaActual.setPropiedad(PropCasilla.CAMINO_HACIA_B, anterior);

    if (siguiente)
      casillaActual.setPropiedad(PropCasilla.CAMINO_HACIA_A, siguiente);

    casillaActual.setPropiedad(PropCasilla.ES_CAMINO, true);
  }
  partida.casillasInicialesPorBando.A = tablero.getCasilla(secuencia[0]);
  partida.casillasInicialesPorBando.B = tablero.getCasilla(
    secuencia[secuencia.length - 1]
  );
}

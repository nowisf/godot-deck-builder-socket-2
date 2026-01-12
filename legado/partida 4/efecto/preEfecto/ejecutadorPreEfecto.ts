import { Partida } from "@domain/partida 4/partida";
import { preEfecto } from "./preEfecto";
import { Jugador } from "@domain/usuario/jugador";
import { FichaBase } from "@domain/ficha/fichaBase";

export function ejecutarPreEfecto(preEfecto: preEfecto, partida: Partida) {
  switch (preEfecto.tipo) {
    case "JUGAR_FICHA":
      preEjecutarJugarFicha(preEfecto, partida);
      break;
  }
}

/* -----------------------------------------
                JUGAR FICHA 
  Añade los siguientes efectos a WEGO:
    1) descuento de escencia segun coste ficha
    2) invocar la ficha en el extremo del camino correspondinte
    3) aplicar el enfriamiento de jugador
    4) aplicar el enfriamiento de ficha_mano
    5) retira la intencion del jugador

    -) aplicar efectos al jugar ficha (si los tiene)
----------------------------------------- */
function preEjecutarJugarFicha(preEfecto: preEfecto, partida: Partida) {
  const jugador = preEfecto.props.jugador as Jugador;
  const fichaBase = preEfecto.props.fichaBase as FichaBase;

  if (jugador.escencia < fichaBase.coste) {
    return;
  }

  partida.motorWego;
}

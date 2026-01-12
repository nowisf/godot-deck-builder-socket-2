import { Ficha } from "@domain/ficha/ficha";
import { Efecto } from "./efecto";
import { Casilla } from "../casilla";
import { Partida } from "../partida";
import { Fase } from "../fases/fase";
import { Coords } from "../coords";
import { FormaArea } from "../tablero";
import { Jugador } from "@domain/usuario/jugador";

export function ejecutarEfecto(efecto: Efecto, partida: Partida) {
  switch (efecto.tipo) {
    case "DAÑAR":
      ejecutarDañar(efecto);
      break;

    case "AVANZAR":
      ejecutarAvanzar(efecto, partida);
      break;

    case "AGREGAR_VISION":
      ejecutarAgregarVision(efecto, partida);
      break;

    case "QUITAR_VISION":
      ejecutarQuitarVision(efecto, partida);
      break;

    case "AGREGAR_FICHA":
      ejecutarAgregarFicha(efecto, partida);
      break;
  }
}

/* -----------------------------------------
   DAÑAR
----------------------------------------- */
function ejecutarDañar(efecto: Efecto) {
  const daño = efecto.props["daño"] as number;
  const objetivo = efecto.objetivo as Ficha;
  objetivo.vidaActual -= daño;
}

/* -----------------------------------------
   AVANZAR (sin efectos directos de visión)
   Solo mueve la ficha, la visión se actualizará
   en la fase CambiosVision con efectos separados.
----------------------------------------- */
function ejecutarAvanzar(efecto: Efecto, partida: Partida) {
  const ficha = efecto.origen as Ficha;
  if (!ficha || !ficha.coords) return;

  const tablero = partida.tablero;
  const motor = partida.motorWego;
  const casillaOrigen = tablero.getCasilla(ficha.coords) as Casilla;
  if (!casillaOrigen) return;

  const destino =
    ficha.amo.bando === "A"
      ? (casillaOrigen.props["CasillaHaciaA"] as Casilla)
      : (casillaOrigen.props["CasillaHaciaB"] as Casilla);

  if (!destino) return;

  /* -----------------------------
      1) Crear efecto QUITAR_VISION
  ------------------------------ */
  motor.agregarEfecto({
    tipo: "QUITAR_VISION",
    fase: Fase.CambiosVision,
    origen: ficha,
    objetivo: null,
    props: {
      pos: ficha.coords,
      distancia: ficha.stats.vicionDistancia,
      forma: ficha.stats.vicionForma,
      jugador: ficha.amo,
    },
  });

  /* -----------------------------
      2) Mover la ficha
  ------------------------------ */
  casillaOrigen.quitarFicha(ficha);
  destino.agregarFicha(ficha);

  /* -----------------------------
      3) Crear efecto AGREGAR_VISION
  ------------------------------ */
  motor.agregarEfecto({
    tipo: "AGREGAR_VISION",
    fase: Fase.CambiosVision,
    origen: ficha,
    objetivo: null,
    props: {
      pos: destino.coords,
      distancia: ficha.stats.vicionDistancia,
      forma: ficha.stats.vicionForma,
      jugador: ficha.amo,
    },
  });
}

/* -----------------------------------------
   AGREGAR VISIÓN 
----------------------------------------- */
function ejecutarAgregarVision(efecto: Efecto, partida: Partida) {
  const pos = efecto.props["pos"] as Coords;
  const distancia = efecto.props["distancia"] as number;
  const forma =
    (efecto.props["forma"] as FormaArea) ?? ("diamante" as FormaArea);
  const jugador = efecto.props["jugador"] as Jugador;

  if (!pos || !jugador) return;

  partida.tablero.agregarVisionEnRango(pos, distancia, forma, jugador);
}

/* -----------------------------------------
   QUITAR VISIÓN 
----------------------------------------- */
function ejecutarQuitarVision(efecto: Efecto, partida: Partida) {
  const pos = efecto.props["pos"] as Coords;
  const distancia = efecto.props["distancia"] as number;
  const forma =
    (efecto.props["forma"] as FormaArea) ?? ("diamante" as FormaArea);
  const jugador = efecto.props["jugador"] as Jugador;

  if (!pos || !jugador) return;

  partida.tablero.quitarVisionEnRango(pos, distancia, forma, jugador);
}

/* =============================
      AGREGAR_FICHA
============================= */
function ejecutarAgregarFicha(efecto: Efecto, partida: Partida) {
  const ficha = efecto.props["ficha"] as Ficha;
  const posicion = efecto.props["posicion"] as Coords;

  if (!ficha || !posicion) return;

  const casilla = partida.tablero.getCasilla(posicion);
  if (!casilla) return;

  casilla.agregarFicha(ficha);

  /* Efecto de visión */
  partida.motorWego.agregarEfecto({
    tipo: "AGREGAR_VISION",
    fase: Fase.CambiosVision,
    origen: ficha,
    objetivo: null,
    props: {
      pos: posicion,
      distancia: ficha.stats.vicionDistancia,
      forma: ficha.stats.vicionForma,
      jugador: ficha.amo,
    },
  });
}

function ejecutarQuitarFicha(efecto: Efecto, partida: Partida) {
  const ficha = efecto.props["ficha"] as Ficha;
  if (!ficha || !ficha.coords) return;

  const casilla = partida.tablero.getCasilla(ficha.coords);
  if (!casilla) return;

  casilla.quitarFicha(ficha);

  /* Efecto de visión */
  partida.motorWego.agregarEfecto({
    tipo: "QUITAR_VISION",
    fase: Fase.CambiosVision,
    origen: ficha,
    objetivo: null,
    props: {
      pos: ficha.coords,
      distancia: ficha.stats.vicionDistancia,
      forma: ficha.stats.vicionForma,
      jugador: ficha.amo,
    },
  });
}

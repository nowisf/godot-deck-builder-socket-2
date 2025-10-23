import { matchMaker } from "@domain/matchMaking.ts/matchMaking.service";
import { ExtendedWebSocket } from "@sockets/usuariosLogueados";

export function buscarPartida(socket: ExtendedWebSocket) {
  matchMaker.agregarJugador(socket);
  return { ok: true };
}

export function salirCola(socket: ExtendedWebSocket) {
  matchMaker.quitarJugador(socket);
  return { ok: true };
}

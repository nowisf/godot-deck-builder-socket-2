import { ExtendedWebSocket } from "@sockets/usuariosLogueados";

export function manifestarIntencion(
  socket: ExtendedWebSocket,
  idHabilidad: string
) {
  socket.usuario.jugador_actual.manifestarIntencion(idHabilidad);

  return { ok: true };
}

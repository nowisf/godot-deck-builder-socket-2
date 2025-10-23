import { Usuario } from "@domain/usuario/usuario";

export const usuariosConectados = new Map<string, ExtendedWebSocket>();

export interface ExtendedWebSocket extends WebSocket {
  usuario?: Usuario;
}

export function cerrarConexion(nombre: string) {
  const ws = usuariosConectados.get(nombre);
  if (ws) {
    ws.close();
  }
  if (usuariosConectados.has(nombre)) {
    usuariosConectados.delete(nombre);
  }
}

export function agregarUsuarioConectado(
  nombre: string,
  socket: ExtendedWebSocket
) {
  cerrarConexion(nombre);
  usuariosConectados.set(nombre, socket);
}

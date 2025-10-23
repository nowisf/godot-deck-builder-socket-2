import { addFichaToUsuario } from "@db/ficha.repository";
import { getUsuarioPorId } from "@db/usuario.repository";
import { configManager } from "src/data/config";
import { fichasManager } from "src/data/fichas";

export function darFichasBienvenida(usuarioId: number) {
  for (const fichaId of configManager.getFichasBienvenida()) {
    darFichaAUsuario(usuarioId, fichaId);
  }
}

function darFichaAUsuario(usuarioId: number, fichaId: number) {
  if (!fichasManager.getFicha(fichaId.toString())) {
    return;
  }
  if (!getUsuarioPorId(usuarioId)) {
    return;
  }
  addFichaToUsuario(usuarioId, fichaId);
  //si esta conectado añadirlas a su socket.usuario
}

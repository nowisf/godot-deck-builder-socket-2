import { nuevo_mazo } from "@services/mazo.service";

async function handleNuevoMazo(socket, data) {
  try {
    const respuesta = await nuevo_mazo(socket, data);
    socket.send(JSON.stringify({ type: "nuevo_mazo_respuesta", ...respuesta }));
  } catch (err) {
    socket.send(JSON.stringify({ type: "error", mensaje: err.message }));
  }
}

export const mazoHandlers = {
  nuevo_mazo: handleNuevoMazo,
};

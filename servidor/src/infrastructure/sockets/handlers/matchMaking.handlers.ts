import { buscarPartida, salirCola } from "@services/matchMaking.service";

async function handleBuscarPartida(socket, data) {
  try {
    const respuesta = await buscarPartida(socket);
    socket.send(
      JSON.stringify({ type: "buscar_partida_respuesta", ...respuesta })
    );
  } catch (err) {
    socket.send(JSON.stringify({ type: "error", mensaje: err.message }));
  }
}

async function handleCancelarBuscarPartida(socket, data) {
  try {
    const respuesta = await salirCola(socket);
    socket.send(
      JSON.stringify({
        type: "cancelar_buscar_partida_respuesta",
        ...respuesta,
      })
    );
  } catch (err) {
    socket.send(JSON.stringify({ type: "error", mensaje: err.message }));
  }
}

export const matchMakingHandlers = {
  buscar_partida: handleBuscarPartida,
  cancelar_buscar_partida: handleCancelarBuscarPartida,
};

import { manifestarIntencion } from "@services/partida.service";

async function handleJugadaPartida(socket, data) {
  try {
    console.log("handleJugadaPartida llamado con data:", data);
    await manifestarIntencion(socket, data.jugada);
  } catch (err) {
    socket.send(JSON.stringify({ type: "error" }));
    console.log("Error en handleJugadaPartida:", err);
  }
}

export const partidaHandlers = {
  jugada_partida: handleJugadaPartida,
};

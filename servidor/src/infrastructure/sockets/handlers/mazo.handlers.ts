import { cambiarSetCombate, nuevo_mazo } from "@services/mazo.service";

async function handleNuevoMazo(socket, data) {
  try {
    const respuesta = await nuevo_mazo(socket, data);
    socket.send(JSON.stringify({ type: "nuevo_mazo_respuesta", ...respuesta }));
  } catch (err) {
    socket.send(JSON.stringify({ type: "error" }));
    console.log("Error en handleNuevoMazo:", err);
  }
}
async function cambiarMazoCombate(socket, data) {
  try {
    const respuesta = await cambiarSetCombate(socket, data.set_nombre);
    socket.send(
      JSON.stringify({ type: "cambiar_set_combate_respuesta", ...respuesta })
    );
  } catch (err) {
    socket.send(JSON.stringify({ type: "error" }));
    console.log("Error en handleCambiarMazoCombate:", err);
  }
}

export const mazoHandlers = {
  nuevo_mazo: handleNuevoMazo,
  cambiar_set_combate: cambiarMazoCombate,
};

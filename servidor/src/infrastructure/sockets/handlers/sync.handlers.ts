import { syncVersions } from "@services/sync.service";

async function handleVersion(socket, data) {
  try {
    const respuesta = await syncVersions(data);
    socket.send(JSON.stringify({ type: "version_respuesta", ...respuesta }));
  } catch (err) {
    socket.send(JSON.stringify({ type: "error", mensaje: err.message }));
  }
}

export const syncHandlers = {
  version: handleVersion,
};

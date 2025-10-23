import { WebSocketServer } from "ws";
import { usuarioHandlers } from "./handlers/usuario.handlers";
import { syncHandlers } from "./handlers/sync.handlers";
import { mazoHandlers } from "./handlers/mazo.handlers";
import { matchMakingHandlers } from "./handlers/matchMaking.handlers";

const handlers = {
  ...usuarioHandlers,
  ...syncHandlers,
  ...mazoHandlers,
  ...matchMakingHandlers,
};

export default function setupWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("message", async (msg) => {
      console.log("Mensaje recibido:", msg.toString());
      let data;
      try {
        data = JSON.parse(msg.toString());
      } catch {
        socket.send(
          JSON.stringify({ type: "error", mensaje: "JSON inválido" })
        );
        return;
      }

      const handler = handlers[data.type];
      if (!handler) {
        console.log("Evento desconocido:", data.type);
        socket.send(
          JSON.stringify({
            type: "error",
            mensaje: "Evento desconocido: " + data.type,
          })
        );
        return;
      }

      try {
        console.log("Manejando evento:", data.type);
        await handler(socket, data);
      } catch (err: any) {
        console.error("Error manejando evento:", err);
        socket.send(JSON.stringify({ type: "error", mensaje: err.message }));
      }
    });

    socket.on("close", () => console.log("🔴 Cliente desconectado"));
  });

  console.log(`Servidor WebSocket escuchando en ws://localhost:${port}`);
  return wss;
}

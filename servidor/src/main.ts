import { crearTablasJuego, crearTablaUsuarios } from "@db/schema";
import setupWebSocketServer from "@sockets/socket.server";

const WEBSOCKET_PORT = 8080;

async function main() {
  console.log("🟡 Iniciando servidor...");

  try {
    await crearTablaUsuarios();
    await crearTablasJuego();
    console.log("✅ Base de datos lista.");

    setupWebSocketServer(WEBSOCKET_PORT);
  } catch (error) {
    console.error("❌ Error iniciando servidor:", error);
    process.exit(1);
  }
}

main();

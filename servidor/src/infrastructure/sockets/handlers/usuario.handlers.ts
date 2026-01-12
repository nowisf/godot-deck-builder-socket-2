import { login, registrarUsuario } from "@services/usuario.service";
import { cerrarConexion } from "@sockets/usuariosLogueados";

async function handleRegistrarUsuario(socket, data) {
  try {
    const respuesta = await registrarUsuario(data);

    socket.send(JSON.stringify({ type: "register_respuesta", ...respuesta }));
  } catch (err) {
    console.log("Error en handleRegistrarUsuario:", err);
    socket.send(JSON.stringify({ type: "error" }));
  }
}

async function handleLogin(socket, data) {
  try {
    const respuesta = await login(socket, data);

    socket.send(JSON.stringify({ type: "login_respuesta", ...respuesta }));
  } catch (err) {
    console.log("Error en handleLogin:", err);
    socket.send(JSON.stringify({ type: "error" }));
  }
}

async function handleLogOut(socket, data) {
  try {
    await cerrarConexion(socket.usuario.nombre);

    socket.send(JSON.stringify({ type: "logout_respuesta", ok: true }));
  } catch (err) {
    console.log("Error en handleLogout:", err);
    socket.send(JSON.stringify({ type: "error" }));
  }
}

export const usuarioHandlers = {
  register: handleRegistrarUsuario,
  login: handleLogin,
  logout: handleLogOut,
};

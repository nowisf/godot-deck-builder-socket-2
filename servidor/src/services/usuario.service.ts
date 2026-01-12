import bcrypt from "bcrypt";
import {
  CrearUsuarioDTO,
  LoginDTO,
  RegistrarUsuarioMensaje,
} from "@dto/usuario.dto";
import { Usuario } from "@domain/usuario/usuario";
import {
  crearUsuario,
  getHashPorNombre,
  getUsuarioPorEmail,
  getUsuarioPorId,
  getUsuarioPorNombre,
} from "@infrastructure/database/usuario.repository";
import {
  agregarUsuarioConectado,
  cerrarConexion,
} from "@sockets/usuariosLogueados";
import { darFichasBienvenida } from "./fichas.service";
import { getUsuarioFichas } from "@db/ficha.repository";
import { fichasManager } from "src/data/fichas";
import { getUserMazos, getUserMazosDominio } from "@db/mazo.repository";
import { mazoMapper } from "src/mappers/mazo.mapper";

export async function registrarUsuario(
  dto: CrearUsuarioDTO
): Promise<RegistrarUsuarioMensaje> {
  var mensaje: RegistrarUsuarioMensaje = {
    ok: true,
    nombreDisponible: true,
    emailDisponible: true,
  };
  const mailExistente = await getUsuarioPorEmail(dto.email);
  if (mailExistente) {
    mensaje.ok = false;
    mensaje.emailDisponible = false;
  }
  const usuarioExistente = await getUsuarioPorNombre(dto.usuario);
  if (usuarioExistente) {
    mensaje.ok = false;
    mensaje.nombreDisponible = false;
  }

  if (!mensaje.ok) return mensaje;

  dto.clave = await bcrypt.hash(dto.clave, 10);
  var usuario = await crearUsuario(dto);
  darFichasBienvenida(usuario.id);

  console.log("Usuario creado:", usuario);
  return mensaje;
}

//Sin usar
export async function obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
  const data = await getUsuarioPorId(id);
  return data
    ? new Usuario(data.id, data.nombre, data.email, data.creado_en)
    : null;
}

export async function login(socket, dto: LoginDTO) {
  const { usuario, clave } = dto;

  const user = await getUsuarioPorNombre(usuario);
  if (!user) return { ok: false, msg: "Usuario no encontrado" };

  const match = await bcrypt.compare(clave, await getHashPorNombre(usuario));
  if (!match) return { ok: false, msg: "Contraseña incorrecta" };

  cerrarConexion(usuario);
  socket.usuario = new Usuario(
    user.id,
    user.nombre,
    user.email,
    user.creado_en,
    socket
  );

  var fichasPoseidas = await getUsuarioFichas(user.id);
  fichasPoseidas.forEach((ficha) => {
    socket.usuario.agregarFicha(fichasManager.getFicha(ficha.id));
  });

  agregarUsuarioConectado(socket.usuario.nombre, socket);

  const mazos = await getUserMazosDominio(user.id);
  socket.usuario.mazos = mazos;
  socket.send(
    JSON.stringify({
      type: "sets_coleccion",
      mazos: mazos.map(mazoMapper.toClient),
    })
  );

  socket.send(
    JSON.stringify({ type: "fichas_poseidas", fichas: fichasPoseidas })
  );
  console.log("Usuario logueado:", socket.usuario.nombre);
  return { ok: true };
}

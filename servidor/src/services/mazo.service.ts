import { getUsuarioTieneFicha } from "@db/ficha.repository";
import {
  addFichaToMazo,
  crearMazo,
  getMazoPorNombreYUsuario,
} from "@db/mazo.repository";
import { crearMazoNuevoDTO } from "@dto/mazo.dto";

export async function nuevo_mazo(socket, crearMazoNuevoDTO: crearMazoNuevoDTO) {
  let mensaje = {
    validoOk: false,
    nombreOk: false,
    mazo_nombre: crearMazoNuevoDTO.nombre_mazo,
    mazo: crearMazoNuevoDTO.set,
  };

  const esValido = await validarSet(socket, crearMazoNuevoDTO.set);
  if (!esValido) {
    return mensaje;
  }

  mensaje.validoOk = true;

  const mazoExistente = await getMazoPorNombreYUsuario(
    crearMazoNuevoDTO.nombre_mazo,
    socket.usuario.id
  );

  if (mazoExistente) {
    return mensaje;
  }
  mensaje.nombreOk = true;

  //const nuevoMazo =
  await crearSet(
    crearMazoNuevoDTO.nombre_mazo,
    crearMazoNuevoDTO.set,
    socket.usuario.id
  );

  //mensaje.mazo = nuevoMazo;
  return mensaje;
}

export async function validarSet(
  socket,
  set: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ]
) {
  if (set.length !== 10) {
    return false;
  }

  const unico = new Set(set);
  if (unico.size !== 10) {
    return false; // no son todos distintos
  }

  if (!(await usuarioTieneFichasMazo(socket.usuario.id, set))) {
    return false;
  }

  return true;
}

async function usuarioTieneFichasMazo(
  usuarioId: number,
  set: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ]
) {
  for (const fichaId of set) {
    if (!(await getUsuarioTieneFicha(usuarioId, fichaId))) {
      return false;
    }
  }
  return true;
}

export async function crearSet(
  nombre_set: string,
  fichas: number[],
  usuarioId: number
) {
  // Crear el set en la base de datos
  const nuevoSet = await crearMazo(usuarioId, nombre_set);

  var puesto = 0;

  for (const fichaId of fichas) {
    addFichaToMazo(nuevoSet.id, fichaId, puesto);
    puesto++;
  }

  return nuevoSet;
}

import { CrearUsuarioDTO, DBUsuario } from "@dto/usuario.dto";
import pool from "./pool";

export async function crearUsuario(dto: CrearUsuarioDTO): Promise<DBUsuario> {
  const query = `
    INSERT INTO usuarios (nombre, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, nombre, email, creado_en;
  `;

  const values = [dto.usuario, dto.email, dto.clave];
  const result = await pool.query(query, values);

  // devuelve el registro recién insertado
  return result.rows[0];
}

export async function getUsuarioPorEmail(
  email: string
): Promise<DBUsuario | null> {
  const query = `
    SELECT id, nombre, email, creado_en
    FROM usuarios
    WHERE email = $1;
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}

export async function getUsuarioPorId(id: number): Promise<DBUsuario | null> {
  const query = `
    SELECT id, nombre, email, creado_en
    FROM usuarios
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function getUsuarioPorNombre(
  nombre: string
): Promise<DBUsuario | null> {
  const query = `
    SELECT id, nombre, email, creado_en
    FROM usuarios
    WHERE nombre = $1;
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows[0] || null;
}

export async function getHashPorNombre(nombre: string): Promise<string | null> {
  const query = `
    SELECT password_hash
    FROM usuarios
    WHERE nombre = $1;
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows[0]?.password_hash || null;
}

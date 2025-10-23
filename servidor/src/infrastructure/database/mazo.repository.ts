import { DBMazo } from "@dto/mazo.dto";
import pool from "./pool";

export async function crearMazo(
  usuarioId: number,
  nombre: string
): Promise<DBMazo> {
  const query = `
    INSERT INTO mazos (usuario_id, nombre)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [usuarioId, nombre]);
    console.log(`Mazo '${nombre}' creado para usuario ${usuarioId}`);
    return result.rows[0];
  } catch (error: any) {
    console.error("Error al crear mazo:", error.message);
    throw error;
  }
}

export async function getUserMazos(usuario_id): Promise<DBMazo[]> {
  const result = await pool.query(
    `
    SELECT 
      m.id AS mazo_id,
      m.nombre AS mazo_nombre,
      mf.ficha_id,
      mf.posicion
    FROM mazos m
    LEFT JOIN mazo_fichas mf ON m.id = mf.mazo_id
    WHERE m.usuario_id = $1
    ORDER BY m.id, mf.posicion
    `,
    [usuario_id]
  );

  const mazos = {};
  for (const row of result.rows) {
    if (!mazos[row.mazo_id]) {
      mazos[row.mazo_id] = {
        id: row.mazo_id,
        nombre: row.mazo_nombre,
        creado_en: row.mazo_creado_en,
        fichas: [],
      };
    }
    if (row.ficha_id) {
      mazos[row.mazo_id].fichas.push({
        ficha_id: row.ficha_id,
        posicion: row.posicion,
      });
    }
  }

  return Object.values(mazos);
}

export async function getMazoPorNombreYUsuario(
  nombreMazo: string,
  usuarioId: number
): Promise<DBMazo | null> {
  const query = `
    SELECT *
    FROM mazos
    WHERE usuario_id = $1
      AND nombre = $2
    LIMIT 1;
  `;

  const result = await pool.query(query, [usuarioId, nombreMazo]);

  if (result.rows.length === 0) {
    return null; // No existe ese mazo para el usuario
  }

  return result.rows[0];
}

export async function addFichaToMazo(
  mazoId: number,
  fichaId: number,
  posicion: number
): Promise<void> {
  await pool.query(
    `
    INSERT INTO mazo_fichas (mazo_id, ficha_id, posicion)
    VALUES ($1, $2, $3)
    ON CONFLICT (mazo_id, posicion) DO NOTHING
    `,
    [mazoId, fichaId, posicion]
  );
}

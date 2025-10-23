import { DBFicha } from "@dto/ficha.dto";
import pool from "./pool";

export async function getUsuarioFichas(usuarioId: number): Promise<DBFicha[]> {
  const res = await pool.query(
    `
    SELECT ficha_id AS id
    FROM usuario_fichas
    WHERE usuario_id = $1
    ORDER BY ficha_id ASC
    `,
    [usuarioId]
  );

  return res.rows;
}

export async function addFichaToUsuario(
  usuarioId: number,
  fichaId: number
): Promise<void> {
  await pool.query(
    `
    INSERT INTO usuario_fichas (usuario_id, ficha_id)
    VALUES ($1, $2)
    ON CONFLICT (usuario_id, ficha_id) DO NOTHING
    `,
    [usuarioId, fichaId]
  );
}

export async function getUsuarioTieneFicha(
  usuarioId: number,
  fichaId: number
): Promise<boolean> {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM usuario_fichas
      WHERE usuario_id = $1
        AND ficha_id = $2
    ) AS existe;
  `;

  const result = await pool.query(query, [usuarioId, fichaId]);
  return result.rows[0].existe;
}

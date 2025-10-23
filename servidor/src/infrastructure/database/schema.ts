import pool from "./pool";

export async function crearTablaUsuarios() {
  await pool
    .query(
      `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(100) NOT NULL,
      creado_en TIMESTAMP DEFAULT NOW()
    )
  `
    )
    .then(() => {
      console.log("Tabla 'usuarios' creada o ya existía");
    });
}

export async function crearTablasJuego() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mazos (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      usuario_id INT NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      creado_en TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mazo_fichas (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      mazo_id INT NOT NULL,
      ficha_id INT NOT NULL,
      posicion INT NOT NULL, -- orden de la ficha en el mazo
      FOREIGN KEY (mazo_id) REFERENCES mazos(id) ON DELETE CASCADE,
      UNIQUE (mazo_id, posicion) 
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuario_fichas (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      usuario_id INT NOT NULL,
      ficha_id INT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      UNIQUE (usuario_id, ficha_id)
    );
  `);

  console.log(
    "Tablas 'fichas', 'mazos', 'mazo_fichas' y 'usuario_fichas' creadas o ya existían"
  );
}

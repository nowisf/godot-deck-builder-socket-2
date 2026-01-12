// src/mappers/mazo.mapper.ts
import { Mazo } from "@domain/mazo/mazo";
import { DBMazoConFichas } from "@dto/mazo.dto";
import { fichasManager } from "src/data/fichas";

export const mazoMapper = {
  /** DB → Dominio */
  fromDB(raw: DBMazoConFichas): Mazo {
    const mazo = new Mazo(
      raw.id,
      raw.nombre,
      Array(Mazo.MAX_FICHAS).fill(null)
    );

    for (const ref of raw.fichas) {
      const fichaBase = fichasManager.getFicha(ref.ficha_id);
      if (!fichaBase) {
        throw new Error(`Ficha inexistente: ${ref.ficha_id}`);
      }
      mazo.setFichaEnPosicion(ref.posicion, fichaBase);
    }

    return mazo;
  },

  /** Dominio → Cliente */
  toClient(mazo: Mazo) {
    return {
      id: mazo.id,
      nombre: mazo.nombre,
      fichas: mazo.fichas
        .map((ficha, posicion) =>
          ficha ? { ficha_id: ficha.id, posicion } : null
        )
        .filter(Boolean),
    };
  },
};

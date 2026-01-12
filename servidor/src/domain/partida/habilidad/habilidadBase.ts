// src/domain/partida/habilidad/habilidadBase.ts
import { Habilidad } from "./habilidad";
import { CondicionBase } from "./condicion/condicionBase";

import { Ficha } from "@domain/ficha/ficha";
import { Tablero } from "../tablero";
import { Partida } from "../partida";
import { EfectoBase } from "./efecto/efectoBase";

export interface HabilidadBaseContexto {
  ficha: Ficha;
  tablero: Tablero;
  partida: Partida;
}

export class HabilidadBase {
  constructor(
    public nombre: String,
    public demoraReutilizacion: number,
    public demoraInicial: number,
    public condiciones: CondicionBase[],
    public efectos: EfectoBase[]
  ) {
    console.log(`habilidad ${nombre} creada`);
    condiciones.forEach((condicion) => {
      console.log(condicion.props);
    });
    efectos.forEach((efecto) => {
      console.log(efecto.props);
    });
  }

  toHabilidad(ctx: HabilidadBaseContexto): Habilidad {
    // materializar condiciones
    console.log(`to habilidad: ${this.toString()}`);
    const habilidad = new Habilidad(
      ctx.ficha,
      this.demoraReutilizacion,
      this.demoraInicial,
      [],
      [],
      this.nombre
    );
    habilidad.condiciones = this.condiciones.map((condicionBase) =>
      condicionBase.toCondicion({
        habilidad,
        ficha: ctx.ficha,
        tablero: ctx.tablero,
        jugador: ctx.ficha.amo,
      })
    );
    habilidad.efectos = this.efectos.map((efectoBase) =>
      efectoBase.toEfecto({
        partida: ctx.partida,
        ficha: ctx.ficha,
        jugador: ctx.ficha.amo,
        habilidad,
      })
    );

    return habilidad;
  }
  toString(): string {
    const condiciones = this.condiciones.map((c) => c.props.tipo).join(", ");

    const efectos = this.efectos.map((e) => e.props.tipo).join(", ");

    return `HabilidadBase {
      nombre: ${this.nombre}
      demoraInicial: ${this.demoraInicial}
      demoraReutilizacion: ${this.demoraReutilizacion}
      condiciones: [${condiciones || "—"}]
      efectos: [${efectos || "—"}]
    }`;
  }
}

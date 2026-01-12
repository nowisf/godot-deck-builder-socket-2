import { CondicionBase } from "@domain/partida/habilidad/condicion/condicionBase";
import { CondicionProps } from "@domain/partida/habilidad/condicion/condicionesFactory";
import { EfectoBase } from "@domain/partida/habilidad/efecto/efectoBase";
import { EfectoProps } from "@domain/partida/habilidad/efecto/efectosFactory";
import { HabilidadBase } from "@domain/partida/habilidad/habilidadBase";

export interface HabilidadBaseJSON {
  nombre: string;
  demoraInicial: number;
  demoraReutilizacion?: number;
  condiciones?: CondicionProps[];
  efectos: EfectoProps[];
}

export interface HabilidadBaseDTO {
  nombre: string;
  demoraReutilizacion: number;
  demoraInicial: number;
  condiciones: CondicionProps[];
  efectos: EfectoProps[];
}

export class HabilidadBaseMapper {
  static fromJson(json: HabilidadBaseJSON): HabilidadBase {
    return new HabilidadBase(
      json.nombre,
      json.demoraReutilizacion ?? 0,
      json.demoraInicial ?? 0,

      // condiciones base
      (json.condiciones ?? []).map(
        (condicionProps) => new CondicionBase(condicionProps)
      ),

      // efectos base
      json.efectos.map((efectoProps) => new EfectoBase(efectoProps))
    );
  }

  static toClient(habilidad: HabilidadBase): HabilidadBaseDTO {
    return {
      nombre: habilidad.nombre.toString(),
      demoraReutilizacion: habilidad.demoraReutilizacion,
      demoraInicial: habilidad.demoraInicial,

      condiciones: habilidad.condiciones.map((c) => c.props),
      efectos: habilidad.efectos.map((e) => e.props),
    };
  }
}

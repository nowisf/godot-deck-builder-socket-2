import { Ficha } from "@domain/ficha/ficha";

export enum TipoAlteracion {
  DAÑO = "DAÑO",
  //CURACION = "CURACION",
  //APLICAR_ESTADO = "APLICAR_ESTADO",
  //EMPUJE = "EMPUJE",
}

export type AlteracionConfig = {
  tipo: TipoAlteracion.DAÑO;
  valorMinimo: number;
  valorMaximo: number;
};

export type AlteracionEjecucionProps = AlteracionConfig & { victima: Ficha };

export const generadorAlteracionFicha = {
  [TipoAlteracion.DAÑO]: (props: AlteracionEjecucionProps) => {
    const { valorMinimo, valorMaximo, victima } = props;
    const dañoReal =
      Math.floor(Math.random() * (valorMaximo - valorMinimo + 1)) + valorMinimo;
    const ejecucion = () => {
      victima.dañar(dañoReal);
    };
    const datos = { tipo: TipoAlteracion.DAÑO, valor: dañoReal };

    return { ejecucion, datos };
  },
};

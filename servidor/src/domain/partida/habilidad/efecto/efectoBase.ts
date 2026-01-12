import {
  Efecto,
  EfectoContexto,
  EfectoProps,
  generadorEfectos,
} from "./efectosFactory";

export class EfectoBase<T extends EfectoProps = EfectoProps> {
  constructor(public props: T) {}
  toEfecto(ctx: EfectoContexto): Efecto {
    return generadorEfectos[this.props.tipo](this.props as any, ctx as any);
  }
}

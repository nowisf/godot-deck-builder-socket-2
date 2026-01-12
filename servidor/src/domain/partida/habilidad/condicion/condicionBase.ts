import {
  Condicion,
  CondicionContexto,
  CondicionProps,
  generadorCondiciones,
} from "./condicionesFactory";

export class CondicionBase<T extends CondicionProps = CondicionProps> {
  constructor(public props: T) {}
  toCondicion(ctx: CondicionContexto): Condicion {
    return generadorCondiciones[this.props.tipo](this.props as any, ctx);
  }
}

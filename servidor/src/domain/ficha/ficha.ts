export class Ficha {
  constructor(
    public readonly id: number,
    public nombre: string,
    public imagenFicha: string,
    public imagenSet: string,
    public coste: number
  ) {}
}

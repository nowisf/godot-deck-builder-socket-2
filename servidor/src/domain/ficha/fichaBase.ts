export class FichaBase {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly imagenFicha: string,
    public readonly imagenSet: string,
    public readonly coste: number
  ) {}

  toJSON() {
    // útil para enviar al cliente o guardar
    return {
      id: this.id,
      nombre: this.nombre,
      imagenFicha: this.imagenFicha,
      imagenSet: this.imagenSet,
      coste: this.coste,
    };
  }
}

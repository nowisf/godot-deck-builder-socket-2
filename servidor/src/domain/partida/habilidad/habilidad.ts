import { Ficha } from "@domain/ficha/ficha";
import { Jugador } from "@domain/usuario/jugador";
import { Condicion, CondicionProps } from "./condicion/condicionesFactory";
import {
  Efecto,
  EfectoProps,
  generadorEfectos,
  TipoEfecto,
} from "./efecto/efectosFactory";
import {
  generadorNotificaciones,
  TipoEvento,
} from "../notificaciones/notificacionesFactory";

export interface HabilidadBaseJSON {
  demoraReutilizacion: number;
  demoraInicial: number;
  condiciones?: CondicionProps[];
  efectos?: EfectoProps[];
}

export class Habilidad {
  public enfriamientoActual: number = 0;
  public id: string = crypto.randomUUID();
  constructor(
    public dueño: Jugador | Ficha,
    public demoraReutilizacion: number,
    public demoraInicial: number = 0,
    public efectos: Efecto[],
    public condiciones: Condicion[],
    public nombre: String
  ) {
    var jugador: Jugador;
    if (dueño instanceof Jugador) {
      jugador = dueño;
    } else {
      jugador = dueño.amo;
    }

    this.modificarEnfriamiento(this.demoraInicial);
  }
  agregarEfecto(efecto: Efecto) {
    this.efectos.push(efecto);
  }
  agregarCondicion(condicion: Condicion) {
    this.condiciones.push(condicion);
  }

  puedeEjecutarse(): boolean {
    return this.condiciones.every((c) => c());
  }
  ejecutar() {
    if (!this.puedeEjecutarse()) {
      console.log(`NO puede ejecutarse ${this.toString()}`);
      console.log(this.condiciones);
      return;
    }
    console.log(`PUEDE ejecutarse ${this.toString()}`);

    for (const efecto of this.efectos) {
      efecto();
    }

    this.modificarEnfriamiento(this.demoraReutilizacion);
    console.log(`after cd: ${this.toString()}`);
  }

  modificarEnfriamiento(cambio: number) {
    //agregar logica de vision para mostrar
    const jugador = this.dueño instanceof Jugador ? this.dueño : this.dueño.amo;

    jugador.agregarNotificacion(
      generadorNotificaciones[TipoEvento.APLICAR_ENFRIAMIENTO_HABILIDAD](
        this,
        cambio
      )
    );
    if (cambio < 0 && jugador != this.dueño && this.enfriamientoActual <= 0) {
      this.ejecutar();
    }

    this.enfriamientoActual = Math.max(0, this.enfriamientoActual + cambio);
  }
  toString(): string {
    const dueñoNombre =
      this.dueño instanceof Jugador
        ? `Jugador(${this.dueño.nombre})`
        : `Ficha(${this.dueño.base.nombre})`;

    return [
      `Habilidad: ${this.nombre}`,
      `Dueño: ${dueñoNombre}`,
      `CD actual: ${this.enfriamientoActual}`,
      `CD reutilización: ${this.demoraReutilizacion}`,
      `Efectos: ${this.efectos.length}`,
      `Condiciones: ${this.condiciones.length}`,
    ].join(" | ");
  }
}

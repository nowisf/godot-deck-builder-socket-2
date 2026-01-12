import { Ficha } from "@domain/ficha/ficha";
import { Mazo } from "@domain/mazo/mazo";
import { ExtendedWebSocket } from "@sockets/usuariosLogueados";

import { Partida } from "@domain/partida/partida";

import {
  EventoNotificacion,
  generadorNotificaciones,
  TipoEvento,
} from "@domain/partida/notificaciones/notificacionesFactory";
import { Habilidad } from "@domain/partida/habilidad/habilidad";
import { GenerarHabilidadJugarFichaSiPuede } from "@domain/partida/habilidad/ejecutadorAccion";

export class Jugador {
  public set: Mazo = null;
  public habilidadesPorId = new Map<string, Habilidad>();

  public fichasEnJuego: Ficha[] = [];

  public habilidadPendiente: Habilidad | null = null;

  public notificaciones: EventoNotificacion[] = [];

  public escencia: number = 0;

  constructor(
    public partida: Partida,
    public readonly nombre: string,
    public readonly conexion: ExtendedWebSocket,
    public bando: "A" | "B"
  ) {
    // Al iniciar, las fichas base del jugador son las del usuario

    this.conexion.usuario.partida_actial = partida;

    this.conexion.usuario.jugador_actual = this;

    this.set = conexion.usuario.mazoActual;
    this.setSetPorId();
  }
  enviarNotificaciones() {
    this.conexion.send(
      JSON.stringify({ type: "eventos_turno", data: this.notificaciones })
    );
    //considerar poner puesto real y despues juntarlos sin espacios
    this.notificaciones = [];
  }
  private setSetPorId() {
    // Mapea las fichas del mazo por su id para acceso rápido
    this.habilidadesPorId.clear();

    for (const fichaBase of this.set.fichas) {
      const notificacion = generadorNotificaciones[
        TipoEvento.SET_HABILIDAD_ID_FICHA_SET_MOSTRADOR
      ](fichaBase.id, "pendiente");
      this.agregarNotificacion(notificacion);
      const habilidad = GenerarHabilidadJugarFichaSiPuede(this, fichaBase);
      notificacion.habilidadId = habilidad.id;
      this.habilidadesPorId.set(habilidad.id, habilidad);
    }
  }
  reducirEnfriamientosHabilidades() {
    this.habilidadesPorId.forEach((habilidad) => {
      habilidad.modificarEnfriamiento(-1);
    });
  }

  manifestarIntencion(idHabilidad: string) {
    this.habilidadPendiente = this.habilidadesPorId.get(idHabilidad) || null;

    console.log(
      `Jugador del bando ${this.bando} ha manifestado la intención de usar la habilidad ${this.habilidadPendiente}`
    );
  }
  agregarNotificacion(notificacion: EventoNotificacion) {
    this.notificaciones.push(notificacion);
  }

  toJSON() {
    return {
      nombre: this.nombre,
    };
  }
}

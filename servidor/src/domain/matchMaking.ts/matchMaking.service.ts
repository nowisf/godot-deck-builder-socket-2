import { ExtendedWebSocket } from "@sockets/usuariosLogueados";

class MatchMaker {
  private cola: ExtendedWebSocket[] = [];

  agregarJugador(jugador: ExtendedWebSocket) {
    // Verificar si ya está en la cola
    const yaEnCola = this.cola.some((j) => j.usuario.id === jugador.usuario.id);

    if (yaEnCola) {
      console.log(`${jugador.usuario.nombre} ya está en la cola, no se añade.`);
      return;
    }

    console.log(`${jugador.usuario.nombre} entró a la cola`);
    this.cola.push(jugador);
    this.intentarEmparejar();
  }

  private intentarEmparejar() {
    while (this.cola.length >= 2) {
      const jugador1 = this.cola.shift()!;
      const jugador2 = this.cola.shift()!;

      this.crearPartida([jugador1, jugador2]);
    }
  }

  private crearPartida(jugadores: ExtendedWebSocket[]) {
    console.log(
      `✅ Partida creada entre ${jugadores[0].usuario.nombre} y ${jugadores[1].usuario.nombre}`
    );
  }

  quitarJugador(jugador: ExtendedWebSocket) {
    this.cola = this.cola.filter((j) => j !== jugador);
    console.log(`${jugador.usuario.nombre} salió de la cola`);
  }
}

export const matchMaker = new MatchMaker();

import { FichaBase } from "@domain/ficha/fichaBase";
import { Usuario } from "@domain/usuario/usuario";

class Jugador {
  constructor(public readonly id: number, public usuario: Usuario) {}
}

class FichaEnJuego {
  constructor(
    public readonly fichaBase: FichaBase,
    public estados: number[],
    public posicion: number,
    public jugador: Jugador
  ) {}
}

class Casilla {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public contenido: FichaEnJuego[]
  ) {}
}

class Tablero {
  //13*19 (si es par no conectaria el camino)
  constructor(public ancho: number, public alto: number) {
    const grid: Casilla[][] = [];
    for (let x = 0; x < ancho; x++) {
      const columna: Casilla[] = [];
      for (let y = 0; y < alto; y++) {
        columna.push(new Casilla(x, y, []));
      }
      grid.push(columna);
    }
  }
}

class Mano {
  constructor(
    public fichasEnJuego: FichaEnJuego[],
    public tablero: Tablero, //casilla
    public equipos: Jugador[][], //jugador
    public sets: number[][], //set //set de fichas con estados (0: en mano, 1: en juego, 2: descartada)
    public opcionesEscogidas: number[]
  ) {
    //function añadir jugador
    // public añadirJugador(jugador: Usuario) {
    //   this.equipos.push(Jugador.new(usuario));
    // }
  }
  convocarFichaEnJuego(fichaEnJuego: FichaEnJuego, posicion: number) {
    this.fichasEnJuego.push(fichaEnJuego);
    fichaEnJuego.posicion = posicion;
  }
}

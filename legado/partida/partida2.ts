// partida_engine.ts
// Archivo único con definiciones principales del motor de partida
// Incluye: FichaBase, Ficha, Usuario, Mazo, Jugador, Casilla, Partida,
// AccionJugador, Evento/Efecto, RegistroEfectos y EjecutorEfectos.

// ----------------------------
// Tipos y utilidades
// ----------------------------
export type Bando = "A" | "B";
export type FasePartida =
  | "INICIO_TURNO"
  | "ACCIONES_JUGADORES"
  | "EJECUTAR_ACCIONES"
  | "FIN_TURNO";

// ----------------------------
// FichaBase
// ----------------------------
export class FichaBase {
  constructor(
    public readonly id: string,
    public nombre: string,
    public imagenFicha: string | null = null,
    public imagenSet: string | null = null,
    public coste: number = 0,
    public cdBase: number = 0 // cooldown base en "turnos"
  ) {}
}

// ----------------------------
// Ficha (instancia en juego)
// ----------------------------
export class Ficha {
  public id: number; // asignado por Partida
  public base: FichaBase;
  public amo: Jugador;
  public bando: Bando;
  public vida: number = 0;
  public energia: number = 0;
  public estado: string = "normal";
  public stats: Record<string, number> = {};
  public cdActual: number = 0; // cooldown actual si aplica
  public casilla: Casilla | null = null; // referencia a casilla donde está

  constructor(id: number, base: FichaBase, amo: Jugador) {
    this.id = id;
    this.base = base;
    this.amo = amo;
    this.bando = amo.bando;
    // inicializar stats y vida por defecto (puedes customizar)
    this.stats = { ataque: 0, defensa: 0, velocidad: 0 };
    this.vida = 10; // valor ejemplo
    this.cdActual = 0;
  }

  modificarStat(nombre: string, delta: number) {
    if (!(nombre in this.stats)) this.stats[nombre] = 0;
    this.stats[nombre] += delta;
  }
}

// ----------------------------
// Usuario, Mazo y Jugador
// ----------------------------
export class Mazo {
  static readonly MAX_FICHAS = 10;
  public fichas: (FichaBase | null)[];

  constructor(
    public id: number,
    public nombre: string,
    fichas?: (FichaBase | null)[]
  ) {
    this.fichas = fichas ?? Array(Mazo.MAX_FICHAS).fill(null);
  }

  obtenerFicha(pos: number): FichaBase | null {
    return this.fichas[pos] ?? null;
  }

  setFichaEnPosicion(pos: number, ficha: FichaBase | null) {
    if (pos < 0 || pos >= Mazo.MAX_FICHAS)
      throw new Error("Posición fuera de rango");
    // evitar duplicados por id
    if (ficha && this.fichas.some((f) => f?.id === ficha.id))
      throw new Error("Ficha ya existe en mazo");
    this.fichas[pos] = ficha;
  }
}

export class Usuario {
  constructor(
    public readonly id: number,
    public nombre: string,
    public email: string,
    public creado_en: Date,
    public conexion: WebSocket | null = null,
    public mazoActual: Mazo | null = null,
    public mazos: Mazo[] = [],
    public fichas: FichaBase[] = []
  ) {}

  cambiarNombre(nuevo: string) {
    this.nombre = nuevo.trim();
  }
  agregarFicha(f: FichaBase) {
    this.fichas.push(f);
  }
  seleccionarMazo(m: Mazo) {
    this.mazoActual = m;
  }
}

export class Jugador {
  public set: Mazo | null = null;
  public fichasJugadas: Ficha[] = [];
  public accionPendiente: AccionJugador | null = null;

  constructor(public readonly usuario: Usuario, public bando: Bando) {
    this.set = usuario.mazoActual;
  }
}

// ----------------------------
// Casilla
// ----------------------------
export class Casilla {
  public props: Map<string, any> = new Map();

  constructor(public coordenadas: { x: number; y: number }) {}

  setProp(clave: string, valor: any) {
    this.props.set(clave, valor);
  }
  getProp<T>(clave: string): T | undefined {
    return this.props.get(clave);
  }
  hasProp(clave: string) {
    return this.props.has(clave);
  }
  removeProp(clave: string) {
    this.props.delete(clave);
  }

  agregarUnidad(ficha: Ficha) {
    if (!this.props.has("unidades")) this.props.set("unidades", []);
    const arr = this.props.get("unidades");
    arr.push(ficha);
    ficha.casilla = this;
  }

  quitarUnidad(ficha: Ficha) {
    const arr = this.props.get("unidades") ?? [];
    const idx = arr.indexOf(ficha);
    if (idx >= 0) arr.splice(idx, 1);
    ficha.casilla = null;
  }

  obtenerUnidades(): Ficha[] {
    return this.props.get("unidades") ?? [];
  }
}

// ----------------------------
// Acciones y eventos
// ----------------------------
export type TipoAccionJugador = "JUGAR_FICHA" | "PASAR" | "HABILIDAD";
export interface AccionJugador {
  jugador: Jugador;
  tipo: TipoAccionJugador;
  [key: string]: any;
}

export interface Efecto {
  nombre: string;
  props?: Record<string, any>;
  objetivos: any[]; // pueden ser strings que el selector resolverá o entidades concretas
}

export interface Evento {
  nombre: string;
  fase: FasePartida;
  efectos: Efecto[];
}

export interface ContextoEjecucion {
  partida: Partida;
  jugador?: Jugador;
  fuente?: any;
}

// ----------------------------
// Registro y ejecutor de efectos dinámicos
// ----------------------------
export type SelectorObjetivos = (
  criterio: string,
  contexto: ContextoEjecucion
) => any[];

interface DefinicionEfecto {
  ejecutar: (efecto: Efecto, contexto: ContextoEjecucion) => void;
  seleccionarObjetivos?: SelectorObjetivos;
}

export const RegistroEfectos: Record<string, DefinicionEfecto> = {};

export function registrarEfecto(nombre: string, definicion: DefinicionEfecto) {
  RegistroEfectos[nombre] = definicion;
}

export class EjecutorEfectos {
  ejecutarEvento(evento: Evento, contexto: ContextoEjecucion) {
    for (const efecto of evento.efectos) {
      const def = RegistroEfectos[efecto.nombre];
      if (!def) {
        console.warn(`Efecto no registrado: ${efecto.nombre}`);
        continue;
      }

      // resolver objetivos si vienen como criterios
      let objetivos = efecto.objetivos ?? [];
      if (
        objetivos.length > 0 &&
        typeof objetivos[0] === "string" &&
        def.seleccionarObjetivos
      ) {
        // si objetivo es string y hay selector, lo resolvemos
        objetivos = def.seleccionarObjetivos(objetivos[0], contexto);
      }

      def.ejecutar({ ...efecto, objetivos }, contexto);
    }
  }
}

// ----------------------------
// Efectos básicos registrados
// ----------------------------
// MODIFICAR_STAT: crea stat si no existe y aplica delta
registrarEfecto("MODIFICAR_STAT", {
  ejecutar: (efecto, contexto) => {
    const stat = efecto.props?.stat;
    const cantidad = efecto.props?.cantidad;
    if (!stat || typeof cantidad !== "number") return;
    for (const obj of efecto.objetivos) {
      // objetivo puede ser ficha, casilla, jugador, etc.
      if (obj == null) continue;
      // si es ficha con stats
      if (obj instanceof Ficha) {
        obj.modificarStat(stat, cantidad);
      } else if (obj instanceof Casilla) {
        // casilla: guardamos como prop
        const cur = obj.getProp<number>(stat) ?? 0;
        obj.setProp(stat, cur + cantidad);
      } else if (obj instanceof Jugador) {
        // jugador: guardar stats en usuario si necesitas
        (obj as any)[stat] = ((obj as any)[stat] ?? 0) + cantidad;
      } else {
        // objeto genérico
        (obj as any)[stat] = ((obj as any)[stat] ?? 0) + cantidad;
      }
    }
  },

  seleccionarObjetivos: (criterio, { partida, jugador, fuente }) => {
    // criterios: "ficha:todas", "ficha:enemigas_en_rango", "ficha:lanzador", "jugadores:todos"
    switch (criterio) {
      case "ficha:todas":
        return partida.obtenerTodasLasFichas();
      case "jugadores:todos":
        return [...partida.bandoA, ...partida.bandoB];
      case "ficha:lanzador":
        return fuente ? [fuente] : [];
      case "ficha:enemigas_en_rango":
        if (!fuente || !(fuente instanceof Ficha)) return [];
        return partida.obtenerFichasEnRango(
          fuente,
          fuente.props?.rango ?? 2,
          (f: Ficha) => f.bando !== fuente.bando
        );
      default:
        console.warn(`Criterio de objetivo no reconocido: ${criterio}`);
        return [];
    }
  },
});

// DISMINUIR_CD: disminuye cdActual en fichas objetivo y limpia lista de enfriamiento si aplica
registrarEfecto("DISMINUIR_CD", {
  ejecutar: (efecto, { partida }) => {
    const cantidad = efecto.props?.cantidad ?? 1;
    for (const ficha of efecto.objetivos) {
      if (ficha && typeof ficha.cdActual === "number") {
        ficha.cdActual = Math.max(0, ficha.cdActual - cantidad);
      }
    }
    // Si Partida mantiene fichasEnEnfriamiento, actualizarla (si existe)
    if ((partida as any).fichasEnEnfriamiento) {
      (partida as any).fichasEnEnfriamiento = (
        partida as any
      ).fichasEnEnfriamiento.filter((f: Ficha) => f.cdActual > 0);
    }
  },
});

// ----------------------------
// Partida
// ----------------------------
export class Partida {
  public bandoA: Jugador[] = [];
  public bandoB: Jugador[] = [];
  public mapa: Casilla[][] = [];

  // casillas iniciales
  private casillaInicialA: Casilla | null = null;
  private casillaInicialB: Casilla | null = null;

  // contadores y colas
  private contadorFichas = 0;
  private numeroTurno = 0;
  private accionesPendientes: AccionJugador[] = [];
  public efectosPendientes: Efecto[] = [];

  // opcional: lista de fichas en enfriamiento
  public fichasEnEnfriamiento: Ficha[] = [];

  public ancho = 10;
  public alto = 3;

  constructor(public readonly id: string) {}

  agregarJugador(j: Jugador) {
    j.accionPendiente = null;
    if (j.bando === "A") this.bandoA.push(j);
    else this.bandoB.push(j);
  }

  comenzar() {
    // crear mapa
    for (let y = 0; y < this.alto; y++) {
      const fila: Casilla[] = [];
      for (let x = 0; x < this.ancho; x++) fila.push(new Casilla({ x, y }));
      this.mapa.push(fila);
    }

    // conectar caminos
    for (let y = 0; y < this.alto; y++) {
      for (let x = 0; x < this.ancho; x++) {
        const actual = this.mapa[y][x];
        if (x < this.ancho - 1)
          actual.setProp("caminoSiguiente", this.mapa[y][x + 1]);
        if (x > 0) actual.setProp("caminoAnterior", this.mapa[y][x - 1]);
      }
    }

    // casillas iniciales
    const filaCentral = Math.floor(this.alto / 2);
    this.casillaInicialA = this.mapa[filaCentral][0];
    this.casillaInicialB = this.mapa[filaCentral][this.ancho - 1];
  }

  // registrar/actualizar acción del jugador
  setAccion(jugador: Jugador, accion: AccionJugador) {
    const existente = this.accionesPendientes.find(
      (a) => a.jugador === jugador
    );
    if (existente) Object.assign(existente, accion);
    else this.accionesPendientes.push(accion);
  }

  // ejecutar todas las acciones que declararon los jugadores
  ejecutarTurno() {
    this.numeroTurno++;

    // 1) crear evento INICIAR_TURNO: ejemplo disminuir CDs en fichasEnEnfriamiento
    const eventoInicio: Evento = {
      nombre: "INICIAR_TURNO",
      fase: "INICIO_TURNO",
      efectos: [
        {
          nombre: "DISMINUIR_CD",
          objetivos: this.fichasEnEnfriamiento,
          props: { cantidad: 1 },
        },
      ],
    };

    const ejecutor = new EjecutorEfectos();
    ejecutor.ejecutarEvento(eventoInicio, { partida: this });

    // 2) ejecutar acciones declaradas por jugadores (crean efectos si corresponde)
    // aquí transformamos cada AccionJugador en efectos concretos y los encolamos
    for (const accion of this.accionesPendientes) {
      switch (accion.tipo) {
        case "JUGAR_FICHA":
          // la acción puede incluir props adicionales; transformamos en efecto que invoca ficha
          // efecto que tendrá como objetivo la casilla inicial del bando
          const jugador = accion.jugador as Jugador;
          const efectoInvocar: Efecto = {
            nombre: "INVOCAR_FICHA",
            objetivos: [], // el ejecutor o definicion resolverá la invocación
            props: { indiceSet: accion.indiceSet },
          };
          // añadimos contexto: fuente/jugador
          // lo colocamos en la cola de efectos pendientes
          this.efectosPendientes.push(efectoInvocar);
          break;
        case "PASAR":
          // no hace nada
          break;
        case "HABILIDAD":
          // Habilidad puede traer un evento JSON ya formado, empujar efectos
          if (accion.evento) {
            // asumimos que accion.evento es un Evento
            for (const ef of (accion.evento as Evento).efectos)
              this.efectosPendientes.push(ef);
          }
          break;
      }
    }

    // limpiar acciones pendientes
    this.accionesPendientes = [];

    // 3) ejecutar fases: asumimos fase EJECUTAR_ACCIONES para efectos creados
    const eventoGlobal: Evento = {
      nombre: `TURN_${this.numeroTurno}_EFECTOS`,
      fase: "EJECUTAR_ACCIONES",
      efectos: this.efectosPendientes,
    };
    // antes de ejecutar, resolvemos objetivos dinámicos si es necesario: el ejecutor hace eso
    ejecutor.ejecutarEvento(eventoGlobal, { partida: this });

    // limpiar cola de efectos
    this.efectosPendientes = [];

    // fin turno: podríamos ejecutar efectos de FIN_TURNO si hay
  }

  // Invocar ficha directamente (usado por definiciones de efecto "INVOCAR_FICHA")
  invocarFichaDirecto(jugador: Jugador, indiceSet: number) {
    if (!jugador.set) return null;
    const fb = jugador.set.obtenerFicha(indiceSet);
    if (!fb) return null;
    const ficha = new Ficha(this.contadorFichas++, fb, jugador);
    const casillaInicial =
      jugador.bando === "A" ? this.casillaInicialA : this.casillaInicialB;
    casillaInicial?.agregarUnidad(ficha);
    jugador.fichasJugadas.push(ficha);
    return ficha;
  }

  // utilidades para rango y listado
  enRango(
    f1: Ficha,
    f2: Ficha,
    rango: number = 2,
    tipo: "manhattan" | "euclidiano" = "manhattan"
  ) {
    if (!f1.casilla || !f2.casilla) return false;
    const c1 = f1.casilla.coordenadas;
    const c2 = f2.casilla.coordenadas;
    if (tipo === "manhattan")
      return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y) <= rango;
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    return Math.sqrt(dx * dx + dy * dy) <= rango;
  }

  obtenerTodasLasFichas() {
    return this.mapa.flatMap((fila) =>
      fila.flatMap((c) => c.obtenerUnidades())
    );
  }

  obtenerFichasEnRango(
    fuente: Ficha,
    rango: number,
    filtro?: (f: Ficha) => boolean
  ) {
    return this.obtenerTodasLasFichas().filter(
      (o) =>
        o !== fuente && this.enRango(fuente, o, rango) && (!filtro || filtro(o))
    );
  }
}

// ----------------------------
// Registrar efecto INVOCAR_FICHA para que el ejecutor lo haga real
// ----------------------------
registrarEfecto("INVOCAR_FICHA", {
  ejecutar: (efecto, contexto) => {
    // efecto.props.indiceSet, contexto.jugador o contexto.fuente pueden identificar quien invoca
    const partida = contexto.partida;
    const indice = efecto.props?.indiceSet;
    // si el efecto fue creado a partir de una AccionJugador, el ejecutor no tiene jugador directo.
    // Permitimos que efecto.props.jugadorId o efecto.props.jugadorRef se usen.
    const jugadorRef: Jugador | undefined =
      efecto.props?.jugadorRef ?? contexto.jugador;
    if (!jugadorRef) {
      console.warn("INVOCAR_FICHA sin referencia a jugador");
      return;
    }
    partida.invocarFichaDirecto(jugadorRef, indice);
  },
  seleccionarObjetivos: undefined,
});

// ----------------------------
// Helper: cargar evento desde JSON (resuelve strings tal cual)
// ----------------------------
export function cargarEventoDesdeJSON(json: any): Evento {
  // asume json tiene nombre, fase y efectos[]
  return {
    nombre: json.nombre,
    fase: json.fase as FasePartida,
    efectos: json.efectos ?? [],
  };
}

// ----------------------------
// Fin
// ----------------------------

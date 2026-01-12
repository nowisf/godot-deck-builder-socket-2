export interface DBMazo {
  id: number;
  usuario_id: number;
  nombre: string;
  creado_en: Date;
}

export interface DBMazoConFichas {
  id: number;
  nombre: string;
  creado_en: Date;
  fichas: {
    ficha_id: number;
    posicion: number;
  }[];
}

export interface crearMazoNuevoDTO {
  nombre_mazo: string;
  set: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}

export interface editarMazoDTO {
  mazo_editado: string;
  nombre_mazo: string;
  set: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}

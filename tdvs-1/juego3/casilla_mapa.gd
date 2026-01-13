extends Control

var fichas_por_bando = {
	Bandos.ALIADO: [],
	Bandos.ENEMIGO: []
}
var casillas_por_lado = 2

var _punteros_siguientes_puestos = {
	Bandos.ALIADO: Vector2i(0,0),
	Bandos.ENEMIGO: Vector2(0,0)
}

@export var tamaño_objetivo = 400

@export var margen_central = 2
@export var margenes_laterales = 2
@export var margenes_verticales = 3

@onready var camera_2d: Camera2D = $Camera2D
const FICHA_JUEGO_VISTA = preload("uid://bdi11jxgrqwlx")

enum Bandos { ALIADO, ENEMIGO }

func _ready() -> void:
	
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	agregar_ficha(FICHA_JUEGO_VISTA.instantiate(),Bandos.ALIADO)
	
	var ficha:FichaJuegoVista = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	ficha = FICHA_JUEGO_VISTA.instantiate()
	agregar_ficha(ficha,Bandos.ENEMIGO)
	ficha.hacer_enemiga()
	


func dibujar():

	_punteros_siguientes_puestos[Bandos.ALIADO] = Vector2i(0,0)
	_punteros_siguientes_puestos[Bandos.ENEMIGO] = Vector2i(0,0)

	for ficha:FichaJuegoVista in fichas_por_bando[Bandos.ALIADO]:
		colocar_ficha_vista(ficha,Bandos.ALIADO)

func colocar_ficha_vista(ficha_juego_vista:FichaJuegoVista, bando:Bandos):
	add_child(ficha_juego_vista)
	ficha_juego_vista.position = _punteros_siguientes_puestos[bando]*40\
	 + Vector2i(margenes_laterales,margenes_verticales)
	_punteros_siguientes_puestos[bando].x += 1
	if(_punteros_siguientes_puestos[bando].x > casillas_por_lado/2 - 1):
		_punteros_siguientes_puestos[bando].x = 0 
		_punteros_siguientes_puestos[bando].y += 1
		
	if(bando == Bandos.ENEMIGO):
		ficha_juego_vista.position.x += casillas_por_lado/2*40 + margen_central

func _ajustar_camara():

	var zoom_factor = tamaño_objetivo / _get_pixeles_lado()
	camera_2d.zoom = Vector2(zoom_factor, zoom_factor)
	
	

func agregar_ficha(ficha_juego_vista:FichaJuegoVista, bando:Bandos):
	fichas_por_bando[bando].append(ficha_juego_vista)
	
	var tamaño_requerido = _get_tamaño_requerido_tablero()
	if tamaño_requerido != casillas_por_lado:
		casillas_por_lado =  tamaño_requerido
		_ajustar_camara()
		dibujar()
	else: colocar_ficha_vista(ficha_juego_vista, bando)

func _get_pixeles_lado():
	return _get_tamaño_requerido_tablero() * 40 + margenes_verticales*2

func _get_tamaño_requerido_tablero() -> int:
	var mayor = max(
		fichas_por_bando[Bandos.ALIADO].size(),
		fichas_por_bando[Bandos.ENEMIGO].size()
	)
	var x = 2
	while x * x / 2 < mayor:
		x += 2
	return x

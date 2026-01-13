extends Node2D
class_name TableroJuego

@export var tamaño_casilla := 400
@export var mapa_dimensiones := Vector2(30, 30) 


const CASILLA_ESCALABLE:PackedScene = preload("uid://n2qt1v7ltla0")
const FICHA_ESCALABLE = preload("uid://brwg8tjjc6yev")


var casillas: Dictionary[Vector2i, CasillaEscalable] = {}

func _ready() -> void:
	_generar_mapa()

func _generar_mapa() -> void:
	for y in range(mapa_dimensiones.y):
		for x in range(mapa_dimensiones.x):
			var coord := Vector2i(x, y)

			var casilla:CasillaEscalable = CASILLA_ESCALABLE.instantiate()
			casilla.position = coord * tamaño_casilla
			add_child(casilla)
			casilla.escalar_a_objetivo(tamaño_casilla)
			casilla.coords = coord
			casillas[coord] = casilla



func cambiar_base_casilla(coord, nombre_textura:String):
	print(nombre_textura)
	casillas[coord].cambiarTexturaValdosa(nombre_textura)
	
func establecer_vicion_casilla(coord, esVisible:bool):
	casillas[coord].cambiar_visibilidad(esVisible)
	
func mover_ficha_a(ficha:FichaEscalable, coords:Vector2i):
	casillas[coords].agregar_ficha_desde_casilla(ficha)
	

func colocar_ficha_instancia(ficha:FichaInstanciaData):
	var ficha_escalale:FichaEscalable = FICHA_ESCALABLE.instantiate()
	ficha_escalale.establecer_ficha_instancia_data(ficha)
	casillas[ficha.coords].agregar_ficha(ficha_escalale, ficha.bando)
	return ficha_escalale

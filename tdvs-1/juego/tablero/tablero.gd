extends Node2D
class_name Tablero

@export var casilla_scene: PackedScene

@export var tamaño_tablero: Vector2i

@export var ficha: PackedScene

const tamaño_lado_casilla = 128

@export var fichas:Dictionary

var trol: Ficha

func _ready():
	crear_tablero()
	var sapito: Ficha = ficha.instantiate()
	colocar_ficha(Vector2i(2,2) , sapito)
	
	sapito.rotar_derecha(2,2)
	sapito.desplazar(Vector2i(3,3),2)
	#sapito.activar_camara()
	
	var porrito: Ficha = ficha.instantiate()
	colocar_ficha(Vector2i(6,6) ,porrito)
	var image = Image.new()
	porrito.cambiarImagen("porrito")
	porrito.activar_camara()
	porrito.desplazar(Vector2i(-1,-1),4)
	porrito.rotar_derecha(2,4)

	trol=porrito
	

func trole():
	trol.dramatic_zoom(0.25)
	


func crear_tablero():
	for y in tamaño_tablero.y:
		for x in tamaño_tablero.x:
			colocar_casilla(Vector2i(x,y))

func colocar_ficha(posicion:Vector2i, ficha:Ficha):
	ficha.position = posicion * tamaño_lado_casilla 
	ficha.position.x += tamaño_lado_casilla/2
	ficha.position.y += tamaño_lado_casilla/2
	add_child(ficha)

	ficha.tamaño_casillas = tamaño_lado_casilla

func colocar_casilla(posicion:Vector2i):
	var casilla = casilla_scene.instantiate()
	casilla.position = posicion * tamaño_lado_casilla
	add_child(casilla)

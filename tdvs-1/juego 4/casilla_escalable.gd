extends Node2D
class_name CasillaEscalable

signal casilla_clickeada(casilla_node)

@onready var niebla: Sprite2D = $Niebla

@onready var base: Sprite2D = $Base

@export var tamaño_objetivo:int
@export var margen = 2
@export var coords: Vector2i

@export var vision: bool = false

enum Bandos { ALIADO, ENEMIGO }

var fichas_por_bando = {
	Bandos.ALIADO: [],
	Bandos.ENEMIGO: []
}

var casillas_por_lado = 2

func vicion_obtenida():
	TweensPersonalizados.desaparecer(niebla,1)
	vision = true
	
	
func vicion_perdida():
	TweensPersonalizados.aparecer(niebla,1)
	vision = false
	
	for lista_fichas in fichas_por_bando:
		for ficha:FichaEscalable in fichas_por_bando[lista_fichas]:
			print("wwwww, : ",ficha.ficha_resource.nombre)
			ficha.perder_vicion()
	
func cambiar_visibilidad(esVisible:bool):
	if(esVisible):
		vicion_obtenida()
		return
	vicion_perdida()
	
	

func _ready() -> void:
	escalar_a_objetivo(tamaño_objetivo)



func cambiarTexturaValdosa(nombre_textura:String):
	base.texture = ManagerValdosas.TEXTURAS[nombre_textura]
	Utils.escalar_sprite_a(base, tamaño_objetivo)


func get_fichas_lado_necesarias()-> int:
	var resultado = 1
	var numero_fichas = fichas_por_bando[Bandos.ALIADO].size() + fichas_por_bando[Bandos.ENEMIGO].size() 
	while(numero_fichas>resultado*resultado):
		resultado+=1
	return resultado

func escalar_a_objetivo(objetivo):
	tamaño_objetivo = objetivo
	
	Utils.escalar_sprite_a(base, objetivo)
	Utils.escalar_sprite_a(niebla,objetivo)
	
	dibujar()

func dibujar():
	var contador = 0
	for ficha:FichaEscalable in fichas_por_bando[Bandos.ALIADO]:
		colocar_ficha(ficha,Bandos.ALIADO, contador)

		contador += 1
	contador = 0
	for ficha:FichaEscalable in fichas_por_bando[Bandos.ENEMIGO]:
		colocar_ficha(ficha,Bandos.ENEMIGO, contador)
		contador += 1

func colocar_ficha(ficha:FichaEscalable, bando:Bandos, puesto:int):
	@warning_ignore("integer_division")
	var columna = int(puesto / casillas_por_lado)
	var fila = puesto % casillas_por_lado
	
	if (bando == Bandos.ENEMIGO):
		columna = casillas_por_lado - (columna + 1)
		fila = casillas_por_lado - (fila + 1)
	@warning_ignore("integer_division")
	var lado_ficha = tamaño_objetivo / casillas_por_lado
	var posicion_objetivo_local = Vector2(lado_ficha * columna, lado_ficha * fila )
	

	ficha.movimiento_local(posicion_objetivo_local)
		 

	ficha.escalar_a_objetivo(lado_ficha)
	
	@warning_ignore("integer_division")


func agregar_ficha(ficha_juego_vista:FichaEscalable, bando:Bandos):
	fichas_por_bando[bando].append(ficha_juego_vista)
	add_child(ficha_juego_vista)
	ficha_juego_vista.position = base.texture.get_size()/2 - ficha_juego_vista.get_size()/2

	_incorporar_ficha(ficha_juego_vista)


func agregar_ficha_desde_casilla(ficha_juego_vista:FichaEscalable):
	var bando = ficha_juego_vista.bando
	ficha_juego_vista.get_parent().quitar_ficha(ficha_juego_vista)
	
	fichas_por_bando[bando].append(ficha_juego_vista)

	var posicion_global = ficha_juego_vista.global_position
	
	ficha_juego_vista.reparent(self)
	ficha_juego_vista.global_position = posicion_global

	_incorporar_ficha(ficha_juego_vista)

func _incorporar_ficha(ficha: FichaEscalable):
	if not ficha.borrando.is_connected(quitar_ficha.bind(ficha)):
		ficha.borrando.connect(quitar_ficha.bind(ficha))
	
	var tamaño_requerido = get_fichas_lado_necesarias()
	if tamaño_requerido != casillas_por_lado:
		casillas_por_lado = tamaño_requerido
		dibujar()
	else: 
		var bando = ficha.bando
		colocar_ficha(ficha, bando, fichas_por_bando[bando].size()-1)
	
	if(!vision):
		ficha.perder_vicion(0.2,1.1)
		


func quitar_ficha(ficha: FichaEscalable):

	var bando :Bandos = ficha.bando

	if not fichas_por_bando[bando].has(ficha):
		return
		
	fichas_por_bando[bando].erase(ficha)
	
	if ficha.borrando.is_connected(quitar_ficha.bind(ficha)):
		ficha.borrando.disconnect(quitar_ficha.bind(ficha))

	var tamaño_requerido := get_fichas_lado_necesarias()
	if tamaño_requerido != casillas_por_lado:
		casillas_por_lado = tamaño_requerido

	dibujar()
	


func _on_button_pressed() -> void:
	casilla_clickeada.emit(self)

extends Node2D


@onready var camera_2d: Camera2D = $Camera2D
const FICHA_JUEGO_VISTA = preload("uid://bdi11jxgrqwlx")

var velocidad := 400.0
var zoom_speed := 0.1
var zoom_min := 0.3
var zoom_max := 3.0

@export var TAM_CASILLA := 400
@export var MAPA_TAM := Vector2(30, 30) # ancho y alto del mapa
@export var margen_camara := 200.0 # 🔹 margen extra fuera del mapa

var mapa_tam_pixeles := Vector2.ZERO

func _ready() -> void:
	_generar_mapa()
	mapa_tam_pixeles = MAPA_TAM * TAM_CASILLA

func _process(delta: float) -> void:
	_mover_camara(delta)
	_limitar_camara()

func _mover_camara(delta: float) -> void:
	var movimiento = Vector2.ZERO

	if Input.is_action_pressed("ui_up"):
		movimiento.y -= 1
	if Input.is_action_pressed("ui_down"):
		movimiento.y += 1
	if Input.is_action_pressed("ui_left"):
		movimiento.x -= 1
	if Input.is_action_pressed("ui_right"):
		movimiento.x += 1

	camera_2d.position += movimiento.normalized() * velocidad * delta

func _input(event: InputEvent) -> void:
	# 🔹 Gesto de pellizcar o expandir (touchpad o pantalla)
	if event is InputEventMagnifyGesture:
		var zoom_actual = camera_2d.zoom
		var factor = event.factor
		zoom_actual /= factor
		zoom_actual.x = clamp(zoom_actual.x, zoom_min, zoom_max)
		zoom_actual.y = clamp(zoom_actual.y, zoom_min, zoom_max)
		camera_2d.zoom = zoom_actual

	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			_ajustar_zoom(-zoom_speed)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN and event.pressed:
			_ajustar_zoom(zoom_speed)

func _ajustar_zoom(delta_zoom: float) -> void:
	var zoom_actual = camera_2d.zoom + Vector2(delta_zoom, delta_zoom)
	zoom_actual.x = clamp(zoom_actual.x, zoom_min, zoom_max)
	zoom_actual.y = clamp(zoom_actual.y, zoom_min, zoom_max)
	camera_2d.zoom = zoom_actual

# 🔹 Limita la cámara al área del mapa
func _limitar_camara() -> void:
	var mitad_viewport = (get_viewport_rect().size * camera_2d.zoom) / 2.0

	var limite_izq = -margen_camara + mitad_viewport.x
	var limite_der = mapa_tam_pixeles.x + margen_camara - mitad_viewport.x
	var limite_arr = -margen_camara + mitad_viewport.y
	var limite_abj = mapa_tam_pixeles.y + margen_camara - mitad_viewport.y

	camera_2d.position.x = clamp(camera_2d.position.x, limite_izq, limite_der)
	camera_2d.position.y = clamp(camera_2d.position.y, limite_arr, limite_abj)

# 🧩 Generar mapa con tamaño Vector2
func _generar_mapa() -> void:
	for y in range(MAPA_TAM.y):
		for x in range(MAPA_TAM.x):
			var casilla = FICHA_JUEGO_VISTA.instantiate()
			casilla.position = Vector2(x * TAM_CASILLA, y * TAM_CASILLA)
			add_child(casilla)

	# Centrar mapa en el origen
	position -= (MAPA_TAM * TAM_CASILLA) / 2.0

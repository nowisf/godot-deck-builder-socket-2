extends Panel
class_name PanelDesplazable

var posicion_inicial: Vector2

@export var demora_entrada: float = 1
@export var demora_salida: float = 1

enum direcciones_entrada {ARRIBA, DERECHA }

@export var direccion_entrada: direcciones_entrada = direcciones_entrada.DERECHA

@onready var timer_anti_solapamiento: Timer = $TimerAntiSolapamiento

var mostrando = false

func _ready() -> void:
	posicion_inicial = position
	timer_anti_solapamiento.wait_time = demora_salida
	position = _get_posicion_segun_direccion(direccion_entrada)
	hide()

func _get_posicion_segun_direccion(direccion:direcciones_entrada):
	match direccion:
		direcciones_entrada.DERECHA:
			return Vector2(get_viewport_rect().size.x, posicion_inicial.y)
		direcciones_entrada.ARRIBA:
			return Vector2(posicion_inicial.x, -size.y)


func entrar() -> void:
	position = _get_posicion_segun_direccion(direccion_entrada)
	show()
	mostrando = true
	var tween := get_tree().create_tween()
	
	tween.tween_property(self, "position", posicion_inicial, demora_entrada)\
		.set_trans(Tween.TRANS_ELASTIC)\
		.set_ease(Tween.EASE_OUT)

func retirar() -> void:
	mostrando = false
	var tween := get_tree().create_tween()
	tween.tween_property(self, "position", _get_posicion_segun_direccion(direccion_entrada),\
		demora_salida)\
		.set_ease(Tween.EASE_IN)\
		.set_trans(Tween.TRANS_SPRING)


func cambiarMostrando() -> void:
	if mostrando: 
		ocultar()
	else:
		mostrar()

func ocultar():
	retirar()
	timer_anti_solapamiento.start()

func mostrar():
	entrar()
	timer_anti_solapamiento.stop()

func _on_timer_anti_solapamiento_timeout() -> void:
	hide()

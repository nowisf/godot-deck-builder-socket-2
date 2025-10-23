extends Node2D
class_name Ficha

@onready var imagen = %imagen
@onready var camara = %Camera2D
@export var tamaño_casillas = 1

func cambiarImagen(id_imagen):
	imagen.texture = ImagenesAutoload.get_sprite(id_imagen)

func activar_camara():
	camara.enabled = true
func desactivar_camara():
	camara.enabled = false
	
func rotar_derecha(veces,tiempo):
	var tween := create_tween()
	tween.tween_property(imagen, "rotation", rotation + deg_to_rad(90*veces), tiempo)
	await tween.finished
	
func desplazar(vector_movimiento:Vector2i, tiempo):
	var new_position =  Vector2(position.x + vector_movimiento.x * tamaño_casillas, position.y + vector_movimiento.y * tamaño_casillas)
	var tween := create_tween()
	tween.tween_property(self, "position", new_position, tiempo)
	await tween.finished

func dramatic_zoom(tiempo):
	var tween := create_tween()
	tween.tween_property(camara, "zoom", Vector2(6,6), tiempo)
	await tween.finished

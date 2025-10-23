#ESTO ES UN AUTOLOAD!
extends Node

var sprites = {
	"porrito": preload("res://imagenes/porritoPom.png"),
	"sapito": preload("res://imagenes/sapitoPom.png"),
	
	"casillaSueloDark": preload("res://imagenes/CasillaSueloDark.png")
}

func get_sprite(id: String) -> Texture2D:
	return sprites.get(id, null) # null si no existe

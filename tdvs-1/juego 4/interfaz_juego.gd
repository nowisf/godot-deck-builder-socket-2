extends CanvasLayer
class_name InterfazJuego

@onready var set_juego: SetJuego = $SetJuego
@onready var cantidad_escencia: Label = $EscenciaJugador/CantidadEscencia


func set_set(set_resource:SetResource):
	set_juego.set_set_resource(set_resource)


func cambiar_escencia(cantidad: int):
	var valor_actual := int(cantidad_escencia.text)
	valor_actual += cantidad
	cantidad_escencia.text = str(valor_actual)
	
	set_juego.actualizar_fichas_pagables(valor_actual)


func get_ficha_mano_set_por_id (id:int) :
	return set_juego.get_ficha_mano_set_por_id(id)

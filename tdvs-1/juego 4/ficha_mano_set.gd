extends TextureRect
class_name FichaManoSet


var ficha_resource:FichaResource

@onready var coste_texture: TextureRect = $CosteTexture
@onready var coste_label: Label = $CosteTexture/CosteLabel
@onready var button: Button = $Button
@onready var bloqueo_panel: Panel = $BloqueoPanel
@onready var enfriamiento_label: Label = $BloqueoPanel/EnfriamientoLabel
@onready var ficha_texture: TextureRect = $FichaTexture

@export var id_habilidad: String

var enfriamiento_actual = 0
var coste : int
var pagable: bool


func asignarFicha(fichaResource:FichaResource):
	ficha_resource = fichaResource
	if fichaResource:
		ficha_texture.texture = fichaResource.imagenSet
		coste = fichaResource.coste
		coste_label.text = str(fichaResource.coste)
		coste_texture.show()

func cambiar_enfriamieto(cambio:int):
	enfriamiento_actual += cambio
	
	if enfriamiento_actual < 0:
		enfriamiento_actual = 0
	
	if enfriamiento_actual == 0:
		button.disabled = false
		bloqueo_panel.hide()
	else:
		button.disabled = true
		bloqueo_panel.show()
		enfriamiento_label.text = str(enfriamiento_actual)


func _on_button_pressed() -> void:
	Socket.enviar_mensaje({"type":"jugada_partida", "jugada":id_habilidad})
	

func actualizar_si_se_puede_pagar(escencia_actual):
	var nuevo_estado_pagable = coste <= escencia_actual
	if nuevo_estado_pagable == pagable:
		return
		
	pagable = nuevo_estado_pagable
	if pagable:
		coste_label.add_theme_color_override("font_color", Color.WHITE)
	else:
		coste_label.add_theme_color_override("font_color", Color.RED)

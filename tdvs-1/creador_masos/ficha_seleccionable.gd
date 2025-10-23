extends TextureRect
class_name CasillaFichaEscogible

signal clickeado(casillaFichaEscogible:CasillaFichaEscogible)

@onready var coste_texture = $CosteTexture
@onready var seleccionar_button = $SeleccionarButton
@onready var coste_label = $CosteTexture/CosteLabel
@onready var ficha_texture = $FichaTexture
@onready var bloqueo_panel = $BloqueoPanel
@onready var faltante_panel = $FaltantePanel

@export var ficha_resource:FichaResource

func asignarFicha(fichaResource:FichaResource):
	ficha_resource = fichaResource
	ficha_texture.texture = fichaResource.imagenFicha
	coste_texture.show()
	seleccionar_button.show()
	
	coste_label.text = str(fichaResource.coste)
	
	if !ficha_resource.id in GlobalData.fichas_poseidas:
		cambiar_faltante(true)


func cambiar_faltante(faltante:bool):
	if faltante:
		faltante_panel.show()
	else:
		faltante_panel.hide()


func cambiar_bloqueo(bloquear:bool =true):
	if bloquear:
		seleccionar_button.hide()
		bloqueo_panel.show()
	else:
		seleccionar_button.show()
		bloqueo_panel.hide()

func _on_seleccionar_button_pressed() -> void:
	clickeado.emit(self)

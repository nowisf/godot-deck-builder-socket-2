extends TextureRect
class_name FichaSet

signal clicked(fichaSet:FichaSet)

@export var puesto_set:int

@export var ficha_resource:FichaResource
@onready var coste_label = %CosteLabel
@onready var coste_texture = %CosteTexture
@onready var margen_resaltante = $MargenResaltante
@onready var prepara_eliminacion_texture = $PrepEliminacionTexture

@onready var textura_base = texture

@export var  eliminacion_preparada: bool = false


func asignarFicha(fichaResource:FichaResource):
	ficha_resource = fichaResource
	if fichaResource:
		texture = fichaResource.imagenSet
		coste_label.text = str(fichaResource.coste)
		coste_texture.show()
	else:
		coste_texture.hide()
		texture = textura_base


func _on_button_pressed() -> void:
	clicked.emit(self)
	
func destacar(destacado: bool=true):
	if destacado:
		margen_resaltante.show()
	else:
		margen_resaltante.hide()


func preparar_eliminacion(preparar:bool = true):
	eliminacion_preparada = preparar
	if preparar:
		prepara_eliminacion_texture.show()
	else:
		prepara_eliminacion_texture.hide()

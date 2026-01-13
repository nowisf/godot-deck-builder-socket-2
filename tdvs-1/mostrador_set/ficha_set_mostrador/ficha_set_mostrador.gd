extends TextureRect
class_name FichaSetMostrador


var ficha_resource:FichaResource
@onready var coste_label = $CosteTexture/CosteLabel
@onready var coste_texture = $CosteTexture

@onready var textura_base: Texture2D = texture

func asignarFicha(fichaResource:FichaResource):
	ficha_resource = fichaResource
	if fichaResource:
		texture = fichaResource.imagenSet
		coste_label.text = str(fichaResource.coste)
		coste_texture.show()
	else:
		texture = textura_base
		coste_texture.hide()

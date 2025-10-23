extends TextureRect
class_name FichaSetMostrador


var ficha_resource:FichaResource
@onready var coste_label = $CosteTexture/CosteLabel
@onready var coste_texture = $CosteTexture


func asignarFicha(fichaResource:FichaResource):
	ficha_resource = fichaResource
	if fichaResource:
		texture = fichaResource.imagenSet
		coste_label.text = str(fichaResource.coste)
		coste_texture.show()

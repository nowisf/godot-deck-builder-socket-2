extends Resource
class_name FichaInstanciaData

var id: String
var stats
var ficha_base:FichaResource
var bando: CasillaEscalable.Bandos
var coords: Vector2i

func _init(data_ficha):
	id = data_ficha.id
	stats = data_ficha.stats
	ficha_base = GlobalData.get_ficha_base_por_id(data_ficha.ficha_base_id)
	bando = CasillaEscalable.Bandos.ALIADO if data_ficha.aliada \
		else CasillaEscalable.Bandos.ENEMIGO

	var mensaje_coords = data_ficha.coords
	coords = Vector2i(mensaje_coords.x, mensaje_coords.y)

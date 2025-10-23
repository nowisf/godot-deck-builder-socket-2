extends Resource
class_name SetResource

signal ficha_liberada(ficha_resource:FichaResource)
signal ficha_ocupada(ficha_resource:FichaResource)

signal valides_actualizada(valides:bool)

@export var nombre:String
@export var set_valido:bool = false
@export var slots:Array =[null, null, null, null, null, null, null, null, null, null,]

func cambiar_slot(puesto_slot:int, ficha_resource:FichaResource):
	if puesto_slot > 9:
		push_error("ERRORERINO, superado maximo de slots")
		return
	
	
	if slots[puesto_slot] and ficha_resource != slots[puesto_slot]:
		ficha_liberada.emit(slots[puesto_slot])
	
	slots[puesto_slot] = ficha_resource
	
	if ficha_resource:
		ficha_ocupada.emit(ficha_resource)
		
	_manejar_valides()


func _manejar_valides():
	var valido = !null in slots
	if valido != set_valido:
		set_valido = valido
		valides_actualizada.emit(valido)


func get_mazo_fichas_ids():
	var fichas_ids = []
	for ficha:FichaResource in slots:
		fichas_ids.append(ficha.id)
	return fichas_ids

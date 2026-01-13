extends VBoxContainer
class_name MostradorSet

var espacios_set: Array[FichaSetMostrador] = []

var set_resource:SetResource
const FICHA_SET_MOSTRADOR = preload("uid://b6mjda2nau3xk")




func _ready() :
	GlobalData.set_para_combatir_escogido.connect(set_set_resource)
	
	for i in range(GlobalData.get_slots_por_set()):
		var espacio_set: FichaSetMostrador = FICHA_SET_MOSTRADOR.instantiate()
		add_child(espacio_set)
		espacios_set.append(espacio_set)

func set_set_resource(nuevo_set_resource):
	set_resource = nuevo_set_resource
	if set_resource:
		for i in range(set_resource.slots.size()):
			espacios_set[i].asignarFicha(set_resource.slots[i])
	else:
		for slot in espacios_set:
			slot.asignarFicha(null)
	
	

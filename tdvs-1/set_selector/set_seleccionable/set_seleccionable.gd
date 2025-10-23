extends Panel
class_name SetSeleccionable

var espacios_set_mostrador: Array[FichaSetMostrador] = []

var set_resource:SetResource

@export var ficha_set_mostrador_resource: PackedScene
@onready var set_container = $VBoxContainer/SetVBoxContainer
@onready var nombre_set_label = $VBoxContainer/NombreSetLabel

func _ready() :
	for i in range(GlobalData.get_slots_por_set()):
		var espacio_set: FichaSetMostrador = ficha_set_mostrador_resource.instantiate()
		set_container.add_child(espacio_set)
		espacios_set_mostrador.append(espacio_set)

func set_set_resource(nuevo_set_resource:SetResource):
	set_resource = nuevo_set_resource
	nombre_set_label.text = set_resource.nombre
	for i in range(GlobalData.get_slots_por_set()):
		espacios_set_mostrador[i].asignarFicha(nuevo_set_resource.slots[i])
		

func _on_set_seleccionable_boton_pressed() -> void:
	GlobalData.set_set_para_combatir(set_resource)

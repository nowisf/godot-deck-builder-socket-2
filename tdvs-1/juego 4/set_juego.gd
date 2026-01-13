extends VBoxContainer
class_name SetJuego


var espacios_set: Array[FichaManoSet] = []

var set_resource:SetResource
const FICHA_MANO_SET = preload("uid://bakl1xy1yrmmq")


func _ready() :
	GlobalData.set_para_combatir_escogido.connect(set_set_resource)
	
	for i in range(GlobalData.get_slots_por_set()):
		var espacio_set: FichaManoSet = FICHA_MANO_SET.instantiate()
		add_child(espacio_set)
		espacios_set.append(espacio_set)


func get_ficha_mano_set_por_id (id:int) :
	for i in range(set_resource.slots.size()):
		if espacios_set[i].ficha_resource.id == id:
			return espacios_set[i]

func set_set_resource(nuevo_set_resource):
	if !nuevo_set_resource:
		return
	set_resource = nuevo_set_resource
	for i in range(set_resource.slots.size()):
		espacios_set[i].asignarFicha(set_resource.slots[i])


func actualizar_fichas_pagables(escencia_actual: int):
	for espacio in espacios_set:
		if espacio.ficha_resource:
			espacio.actualizar_si_se_puede_pagar(escencia_actual)

extends Node
const SLOTS_POR_SET = 10
const FICHAS_DIR = "res://Juego2/Fichas/Ejemplares/"
func get_fichas_dir():
	return FICHAS_DIR
func get_slots_por_set():
	return SLOTS_POR_SET

signal nombre_usuario_establecido(nombre)
var nombre_usuario:String
func establecer_nombre_usuario(nombre:String):
	nombre_usuario = nombre
	nombre_usuario_establecido.emit(nombre)

signal fichas_poseidas_establecidas(fichas)
var fichas_poseidas:Array[int]
func establecer_fichas_poseidas(fichas_poseidas_nuevas:Array[int]):
	fichas_poseidas = fichas_poseidas_nuevas
	fichas_poseidas_establecidas.emit(fichas_poseidas)

signal fichas_establecidas(fichas)
@export var fichas:Array[FichaResource]
@export var fichas_dict:Dictionary
func establecer_fichas(fichas_nuevas:Array[FichaResource]):
	fichas = fichas_nuevas
	for ficha in fichas:
		fichas_dict[ficha.id] = ficha
	fichas_establecidas.emit(fichas)

signal set_agregado(sets:SetResource)
signal sets_vaciados()
var sets:Array[SetResource]
func agregar_set(nuevo_set:SetResource):
	sets.append(nuevo_set)
	set_agregado.emit(nuevo_set)
func vaciar_sets():
	sets = []
	sets_vaciados.emit()

signal set_para_combatir_escogido(set_resource:SetResource)
@export var set_para_combatir:SetResource
func set_set_para_combatir(set_resource:SetResource):
	set_para_combatir = set_resource
	set_para_combatir_escogido.emit(set_resource)

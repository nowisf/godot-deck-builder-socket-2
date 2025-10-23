extends Node

const RUTA:String ="res://data/data_persistente/data_persistente.tres"
@onready var data_persistente:DataPersistente = load(RUTA)

func get_version() -> String:
	return data_persistente.version
func set_version(version:String):
	data_persistente.version = version
	ResourceSaver.save(data_persistente, RUTA)

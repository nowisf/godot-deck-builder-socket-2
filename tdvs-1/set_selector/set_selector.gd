extends HBoxContainer

@export var set_seleccionable_scene:PackedScene

func _ready() -> void:
	GlobalData.set_agregado.connect(agregar_set)
	GlobalData.sets_vaciados.connect(vaciar_sets)


func agregar_set(set_resource: SetResource):
	var set_seleccionable = set_seleccionable_scene.instantiate()
	add_child(set_seleccionable)
	set_seleccionable.set_set_resource(set_resource)


func vaciar_sets():
	for child in get_children():
		child.queue_free()

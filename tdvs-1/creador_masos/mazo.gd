extends VBoxContainer
class_name Mazo

@export var  ficha_set_scene : PackedScene

var mazo: Array[FichaSet] = []

var casilla_escogida:CasillaFichaEscogible
var slot_set_escogido:FichaSet

@export var set_resource:SetResource


func set_set_resource(nuevo_set_resource:SetResource):
	set_resource = nuevo_set_resource
	for i in range(GlobalData.get_slots_por_set()):
		mazo[i].asignarFicha(nuevo_set_resource.slots[i])


func _ready() :
	set_process_input(is_visible_in_tree())
	for i in range(GlobalData.get_slots_por_set()):
		var espacio_set: FichaSet = ficha_set_scene.instantiate()
		add_child(espacio_set)
		espacio_set.puesto_set = i
		mazo.append(espacio_set)
		espacio_set.clicked.connect(_on_ficha_set_clicked)


func destacar_espacios(destacar:bool = true):
	for espacio in mazo:
		espacio.destacar(destacar)
		if espacio.eliminacion_preparada:
			espacio.preparar_eliminacion(false)


func cambiar_ficha_set(ficha_set:FichaSet, ficha_resource:FichaResource):
	ficha_set.asignarFicha(ficha_resource)
	set_resource.cambiar_slot(ficha_set.puesto_set, ficha_resource)


func _on_ficha_set_clicked(fichaSet: FichaSet) -> void:
	if casilla_escogida:
		cambiar_ficha_set(fichaSet, casilla_escogida.ficha_resource)
		resetear_estado()
	
	elif slot_set_escogido and fichaSet != slot_set_escogido:
		intercambiar_contenido(fichaSet, slot_set_escogido)
		resetear_estado()
		
	else:
		if fichaSet.ficha_resource != null:
			if(fichaSet.eliminacion_preparada):
				fichaSet.preparar_eliminacion(false)
				cambiar_ficha_set(fichaSet,null)
				resetear_estado()

			else:
				preparar_cambio_contenido(fichaSet)
				fichaSet.preparar_eliminacion()
				get_viewport().gui_release_focus()

		else:
			destacar_casillas_contenedoras()
			slot_set_escogido = fichaSet


func intercambiar_contenido(ficha_a: FichaSet, ficha_b: FichaSet):
	var resource_buffer_a:FichaResource = ficha_a.ficha_resource
	var resource_buffer_b:FichaResource = ficha_b.ficha_resource

	cambiar_ficha_set(ficha_a, null)
	cambiar_ficha_set(ficha_b, null)

	cambiar_ficha_set(ficha_a, resource_buffer_b)
	cambiar_ficha_set(ficha_b, resource_buffer_a)


func destacar_casillas_contenedoras():
	destacar_espacios(false)
	for espacio in mazo:
		if espacio.ficha_resource:
			espacio.destacar()
			if espacio.eliminacion_preparada:
				espacio.preparar_eliminacion(false)


func preparar_cambio_contenido(fichaSet:FichaSet):
	destacar_espacios()
	fichaSet.destacar(false)
	slot_set_escogido = fichaSet

func resetear_estado() -> void:
	casilla_escogida = null
	slot_set_escogido = null
	destacar_espacios(false)
	get_viewport().gui_release_focus()

func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MouseButton.MOUSE_BUTTON_RIGHT and event.pressed and (casilla_escogida or slot_set_escogido):
		resetear_estado()


func _on_selector_fichas_casilla_ficha_escogible_clickeado(casillaFichaEscogible: CasillaFichaEscogible) -> void:
	resetear_estado()
	casilla_escogida = casillaFichaEscogible
	destacar_espacios()


func _on_visibility_changed() -> void:
	set_process_input(is_visible_in_tree())
	

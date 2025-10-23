extends Control

signal listo_button_pressed()
signal cancelar_button_pressed()
signal mazo_creado()

@onready var mazo:Mazo = $Mazo
@onready var nombre_mazo_line_edit:LineEdit = $NombreMazoLineEdit
@onready var listo_button = $ListoButton
@onready var selector_ficha = %SelectorFichas

var set_editando:SetResource

var set_resource:SetResource

func  _ready() -> void:
	Socket.mensaje_recibido.connect(_on_socket_mensaje_recibido)
	#poner de nombre nuevoset1.2.3.4.5...
	restaurar()


func set_sett(sett:SetResource):
	set_resource = sett

	mazo.set_set_resource(set_resource)
	selector_ficha.set_set_resource(set_resource)
	set_resource.valides_actualizada.connect(_set_resource_valides_cambiada)


func _on_socket_mensaje_recibido(mensaje):
	if(mensaje.type == "nuevo_mazo_respuesta"):
		if mensaje.nombreOk and mensaje.validoOk:
			GlobalData.agregar_set(set_resource)
			mazo_creado.emit()
			listo_button_pressed.emit()
		else:
			_mostrarErrorNombre(true)
			
			
func restaurar():
	set_sett(SetResource.new())
	set_editando = null
	_mostrarErrorNombre(false)
	nombre_mazo_line_edit.text = "nuevo mazo"

func _mostrarErrorNombre(error:bool):
	if error:
		var style = StyleBoxFlat.new()
		style.bg_color = Color(1, 0, 0)   # fondo rojo claro

		nombre_mazo_line_edit.add_theme_stylebox_override("normal",style)
	else:
		if nombre_mazo_line_edit.has_theme_stylebox_override("normal"):
			nombre_mazo_line_edit.remove_theme_stylebox_override("normal")


func _on_listo_button_pressed() -> void:
	if set_editando:
		var mismo_sett = true
		for i in range(GlobalData.SLOTS_POR_SET):
			if ! (set_editando.slots[i] == set_resource.slots[i]):
				mismo_sett = false
				break
		if !mismo_sett or set_editando.nombre != nombre_mazo_line_edit.text:
			var socket_mensaje_editar = {
				"type": "editar_mazo",
				"mazo_editado": set_editando.nombre,
				"nombre_mazo": nombre_mazo_line_edit.text,
				"set": set_resource.get_mazo_fichas_ids()
			}
			Socket.enviar_mensaje(socket_mensaje_editar)
			return
		cancelar_button_pressed.emit()
	
	var socket_mensaje = {
		"type": "nuevo_mazo",
		"nombre_mazo": nombre_mazo_line_edit.text,
		"set": set_resource.get_mazo_fichas_ids()
	}
	set_resource.nombre = nombre_mazo_line_edit.text
	Socket.enviar_mensaje(socket_mensaje)


func _on_cancelar_button_pressed() -> void:
	cancelar_button_pressed.emit()
	
	restaurar()

func _set_resource_valides_cambiada(valido: bool):
	listo_button.disabled = !valido

func _on_nombre_mazo_line_edit_text_changed(_new_text: String) -> void:
	_mostrarErrorNombre(false)


func editar_set_combate():
	if GlobalData.set_para_combatir:
		set_editando = GlobalData.set_para_combatir 
		set_sett(GlobalData.set_para_combatir.duplicate())
		set_editando.slots = set_editando.slots.duplicate()
		nombre_mazo_line_edit.text = GlobalData.set_para_combatir.nombre
		_set_resource_valides_cambiada(true)
		_mostrarErrorNombre(false)

extends Control
signal button_crear_mazo_pressed()
signal button_editar_pressed()

@onready var label_nombre_usuario = %NombreUsuarioLabel
@onready var seleccionar_panel_desplazable = $SeleccionarSetPanelDesplazable
@onready var esperando_partida_panel_desplazable = $EsperandoPartidaPanelDesplazable



func _ready() -> void:
	GlobalData.set_para_combatir_escogido.connect(_cambiarVisibilidadPanelSeleccionar)
	GlobalData.nombre_usuario_establecido.connect(establecer_label_usuario)
	Socket.mensaje_recibido.connect(manejarMensajeSocket)



func _on_cancelar_busqueda_partida_button_pressed() -> void:
	var socket_mensaje = {"type": "cancelar_buscar_partida"}
	Socket.enviar_mensaje(socket_mensaje)

func manejarMensajeSocket(mensaje):
	if mensaje.type == "buscar_partida_respuesta":
		if mensaje.ok:
			esperando_partida_panel_desplazable.mostrar()
	if mensaje.type == "cancelar_buscar_partida_respuesta":
		if mensaje.ok:
			esperando_partida_panel_desplazable.ocultar()

func establecer_label_usuario(nombre):
	label_nombre_usuario.text = nombre

func _on_boton_log_out_pressed() -> void:
	var socket_mensaje = {
		"type": "logout"
	}
	Socket.enviar_mensaje(socket_mensaje)


func _on_ir_crear_maso_button_pressed() -> void:
	button_crear_mazo_pressed.emit()


func _on_editar_button_pressed() -> void:
	button_editar_pressed.emit()


func _on_buscar_partida_button_pressed() -> void:
	var mensaje = {"type":"buscar_partida"}
	Socket.enviar_mensaje(mensaje)

func _cambiarVisibilidadPanelSeleccionar():
	seleccionar_panel_desplazable.cambiarMostrando() 
	

func _on_seleccionar_boton_pressed() -> void:
	_cambiarVisibilidadPanelSeleccionar()

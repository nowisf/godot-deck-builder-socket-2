extends Node
#escenas mostrables
@onready var login_scene = $Login
@onready var registro_scene = $InterfaceRegistro
@onready var conectando_scene = $Conectando
@onready var main_menu_scene = $MainMenu
@onready var creador_masos_scene = $CreadorMazos


#que interface se ve actualmente, usado por cambiar_escena_actual para cambiarla
var escena_actual : Node

func _ready():
	cambiar_escena_actual(conectando_scene)
	Socket.conectado.connect(_on_socket_conectado)
	Socket.desconectado.connect(_on_socket_desconectado)
	
	Socket.mensaje_recibido.connect(_on_socket_mensaje_recibido)
func _on_socket_mensaje_recibido(mensaje):
	if(mensaje.type == "logout_respuesta"):
		if(mensaje.ok):
			cambiar_escena_actual(login_scene)


func cambiar_escena_actual(nueva_escena_actual):
	if escena_actual:
		escena_actual.hide()
	nueva_escena_actual.show()		

	escena_actual = nueva_escena_actual
#Manejo de Señales
#Socket
func _on_socket_conectado() -> void:
	cambiar_escena_actual(login_scene)
func _on_socket_desconectado() -> void:
	cambiar_escena_actual(conectando_scene)
#Login
func _on_login_boton_registrar_presionado() -> void:
	cambiar_escena_actual(registro_scene)
func _on_login_login_ok(username: String) -> void:
	cambiar_escena_actual(main_menu_scene)
	GlobalData.establecer_nombre_usuario(username)
#Registro
func _on_interface_registro_back_button_pressed() -> void:
	cambiar_escena_actual(login_scene)
func _on_interface_registro_usuario_creado() -> void:
	cambiar_escena_actual(login_scene)
	login_scene.set_mensaje("Usuario Creado :3")
#Main Menu
func _on_main_menu_button_crear_mazo_pressed() -> void:
	cambiar_escena_actual(creador_masos_scene)
func _on_main_menu_button_editar_pressed() -> void:
	if GlobalData.set_para_combatir:
		creador_masos_scene.editar_set_combate()
		cambiar_escena_actual(creador_masos_scene)
	

#Creador Mazos
func _on_creador_mazos_listo_button_pressed() -> void:
	cambiar_escena_actual(main_menu_scene)
func _on_creador_mazos_cancelar_button_pressed() -> void:
	cambiar_escena_actual(main_menu_scene)

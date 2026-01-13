class_name LoginInterface
extends Control


signal login_ok(username)
signal boton_registrar_presionado()

func _ready() -> void:
	Socket.mensaje_recibido.connect(_on_socket_mensaje_recibido)
func _on_socket_mensaje_recibido(mensaje):
	if(mensaje.type == "login_respuesta"):
		if(mensaje.ok):
			login_ok.emit($Panel/VBoxContainer/UsernameInput.text)
		else:
			set_mensaje(mensaje.msg)


func _on_login_button_pressed() -> void:
	var clave = $Panel/VBoxContainer/PasswordInput.text
	var nombre = $Panel/VBoxContainer/UsernameInput.text
	var socket_mensaje = {
		"type": "login",
		"usuario": nombre,
		"clave": clave,
	}
	Socket.enviar_mensaje(socket_mensaje)

func _on_sign_up_button_pressed() -> void:
	boton_registrar_presionado.emit()

func set_mensaje(mensaje):
	$Panel/VBoxContainer/Panel/Mensaje.text = mensaje

func _on_hidden():
	$Panel/VBoxContainer/Panel/Mensaje.text = ""
	limpiarPassword()

func limpiarPassword():
	$Panel/VBoxContainer/PasswordInput.text = ""

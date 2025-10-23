class_name RegistroInterface
extends Control

signal back_button_pressed()
signal usuario_creado()

func _ready() -> void:
	Socket.mensaje_recibido.connect(_on_socket_mensaje_recibido)
func _on_socket_mensaje_recibido(mensaje):
	if(mensaje.type == "register_respuesta"):
		if(mensaje.ok):
			usuario_creado.emit()
		else:
			if(!mensaje.nombreDisponible):
				set_user_error()
			if(!mensaje.emailDisponible):
				set_mail_error()
	
func _on_boton_registro_pressed() -> void:
	var socket_mensaje = {
		"type": "register",
		"usuario": $Panel/VBoxContainer/InputUsername.text,
		"clave": $Panel/VBoxContainer/InputPassword.text,
		"email":$Panel/VBoxContainer/InputMail.text
	}
	Socket.enviar_mensaje(socket_mensaje)

	
func _on_back_button_pressed() -> void:
	back_button_pressed.emit()

func set_mail_error(text = " is Used"):
	$Panel/VBoxContainer/InputMail.placeholder_text = $Panel/VBoxContainer/InputMail.text + text
	$Panel/VBoxContainer/InputMail.text = ""


func set_user_error(text = " is Used"):
	$Panel/VBoxContainer/InputUsername.placeholder_text = $Panel/VBoxContainer/InputUsername.text + text
	$Panel/VBoxContainer/InputUsername.text = ""


func _on_hidden() -> void:
	$Panel/VBoxContainer/InputMail.text = ""
	$Panel/VBoxContainer/InputUsername.text = ""
	$Panel/VBoxContainer/InputPassword.text = ""
	set_mail_error("")
	set_user_error("")

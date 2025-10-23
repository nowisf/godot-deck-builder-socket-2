#SyncManager.gd?
extends Node

func _ready() -> void:
	Socket.mensaje_recibido.connect(_on_socket_mensaje_recibido)
	Socket.conectado.connect(enviar_version_socket)
	GlobalData.establecer_fichas_poseidas([])


func enviar_version_socket():
	var socket_mensaje = {
		"type": "version",
		"version": ManagerDataPersistente.get_version()
	}
	Socket.enviar_mensaje(socket_mensaje)


func _on_socket_mensaje_recibido(mensaje):
	if(mensaje.type == "fichas_poseidas"):
		var arr: Array[int] = []
		for dictConId in mensaje.fichas:
			arr.append(int(dictConId.id))

		GlobalData.establecer_fichas_poseidas(arr)
		
	if(mensaje.type == "version_respuesta"):
		if !mensaje.ok:
			ManagerDataPersistente.set_version(mensaje.version)
			ManagerFichas.actualizar_fichas(mensaje.fichas)
		#dar fichas a global
		GlobalData.establecer_fichas(ManagerFichas.cargar_todos())
		
	if(mensaje.type == "sets_coleccion"):
		print("A")
		GlobalData.vaciar_sets()
		for sett in mensaje.mazos:
			print(sett.nombre)
			print(sett.fichas)
			var set_resource:SetResource = SetResource.new()
			set_resource.nombre = sett.nombre
			for ficha in sett.fichas:
				set_resource.cambiar_slot(ficha.posicion, GlobalData.fichas_dict[int(ficha.ficha_id)])
			GlobalData.agregar_set(set_resource)

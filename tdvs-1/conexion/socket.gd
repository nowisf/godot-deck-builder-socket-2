extends Node

signal conectado
signal desconectado
signal mensaje_recibido(data)

var socket = WebSocketPeer.new()
var url := "ws://127.0.0.1:8080"

var ultimo_estado_conexion

func _ready():
	print("iniciado modulo Online")
	connect_to_server()

func connect_to_server():
	var err = socket.connect_to_url(url)
	if err != OK:
		push_error("❌ Error al intentar conectar: %s" % err)
	else:
		print("🔌 Intentando conectar a %s..." % url)

func _process(_delta):
	socket.poll()
	var state = socket.get_ready_state()
	if state == WebSocketPeer.STATE_OPEN:
		if ultimo_estado_conexion != WebSocketPeer.STATE_OPEN:
			conectado.emit()
			ultimo_estado_conexion = WebSocketPeer.STATE_OPEN
			print("Conectado")
		
		while socket.get_available_packet_count():
			_on_data(socket.get_packet())
	elif state == WebSocketPeer.STATE_CLOSING:
		# Keep polling to achieve proper close.
		pass
	elif state == WebSocketPeer.STATE_CLOSED:
		if ultimo_estado_conexion != WebSocketPeer.STATE_CLOSED:
			var code = socket.get_close_code()
			var reason = socket.get_close_reason()
			print("WebSocket closed with code: %d, reason %s. Clean: %s" % [code, reason, code != -1])
			ultimo_estado_conexion = WebSocketPeer.STATE_CLOSED
			desconectado.emit()
		else:
			#quiza deba condicionarlo con la razon en caso de que sea intencionado
			socket.connect_to_url(url)

func _on_data(packet):
	var test_json_conv = JSON.new()
	var error = test_json_conv.parse(packet.get_string_from_utf8())
	if error == OK:
		var payload = test_json_conv.get_data()
		#hacer con switch case

		if(payload.type == "error"):
			print("socket error")
			print(payload)
		else:
			mensaje_recibido.emit(payload)
			
	else:
		print("JSON Parse Error: ", error)

func enviar_mensaje(mensaje):
	if socket.get_ready_state() == WebSocketPeer.STATE_OPEN:
		var json_mensaje = JSON.stringify(mensaje)
		socket.send_text(json_mensaje)
	else:
		print("intento de enviar mensaje sin conexion")

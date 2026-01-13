extends Node2D
class_name Juego
@onready var interfaz_juego: InterfazJuego = $"Interfaz Juego"
@onready var tablero: TableroJuego = $Tablero
@onready var zoom_canvas_layer: ZoomLayer = $"Zoom CanvasLayer"

var habilidades_por_id = {}
var fichas_por_id: = {} #string ficha escalable

var is_procesando_turno: bool = false
var cola_mensajes_socket: Array = []

var event_handlers 
			
func _on_visibility_changed() -> void:
	if interfaz_juego:
		if visible:
			interfaz_juego.show()
		else:
			interfaz_juego.hide()

func set_set(nuevo_set:SetResource):
	interfaz_juego.set_set(nuevo_set)

func _ready() -> void:
	
	for casilla in tablero.get_children():
		casilla.casilla_clickeada.connect(_on_casilla_clickeada)
		print("wasapo")
	Socket.mensaje_recibido.connect(_on_socket_mensaje_recibido)
	
	event_handlers = {
	"jugador_cambio_escencia": EventoCambioEscencia.new(interfaz_juego),
	"descontar_todos_los_enfriamientos":EventoDescontarTodosLosEnfriamientos.new(interfaz_juego, habilidades_por_id),
	"aplicar_enfriamiento_habilidad":EventoAplicarEnfriamientoHabilidad.new(interfaz_juego, habilidades_por_id),
	"descubrir_base_casilla":EventoDescubrirBaseCasilla.new(tablero),
	"visibilidad_casilla": EventoVisibilidadCasilla.new(tablero),
	"ficha_revelada": EventoFichaRevelada.new(tablero, fichas_por_id),
	"set_habilidad_id_ficha_set_mostrador": EventoSetHabilidadIdFichaSetMostrador.new(interfaz_juego, habilidades_por_id),
	"ficha_movida": EventoFichaMovida.new(tablero,fichas_por_id),
	"accion_combate": EventoAccionCombate.new(fichas_por_id),
	"ficha_destruida": EventoFichaDestruida.new(fichas_por_id)
	}

func _on_casilla_clickeada(casilla:CasillaEscalable):
	print("Abriendo zoom en: ", casilla.name)
	
	# Le pasamos la posición global exacta de la casilla al minimapa
	zoom_canvas_layer.abrir_con_zoom_automatico(casilla)


func _on_socket_mensaje_recibido(mensaje):
	if mensaje.type != "eventos_turno":
		return
		
	cola_mensajes_socket.append(mensaje)
	
	if not is_procesando_turno:
		_procesar_cola_mensajes()


func _procesar_cola_mensajes():
	if cola_mensajes_socket.is_empty():
		is_procesando_turno = false
		return
		
	is_procesando_turno = true
	var mensaje_actual = cola_mensajes_socket.pop_front()

	#####
	var lista_cruda = mensaje_actual.data
	var eventos_prioritarios = [] # CDs, Maná, UI
	var eventos_secuenciales = [] # Combate, Movimiento, Muerte
	
	var tipos_prioritarios = [
		"descontar_todos_los_enfriamientos", 
		"aplicar_enfriamiento_habilidad", 
		"jugador_cambio_escencia",
		"set_habilidad_id_ficha_set_mostrador"
	]
	for data in lista_cruda:
		if data.type_evento in tipos_prioritarios:
			eventos_prioritarios.append(data)
		else:
			eventos_secuenciales.append(data)
	for data in eventos_prioritarios:
		var handler = event_handlers.get(data.type_evento)
		if handler:
			handler.procesar(data)
		else:
			print("Handler prioritario faltante: ", data.type_evento)
	
	var i = 0
	while i < eventos_secuenciales.size():
		var data = eventos_secuenciales[i]
		var handler = event_handlers.get(data.type_evento)
		
		if not handler:
			print("Handler faltante: ", data.type_evento)
			i += 1
			continue

		# --- LOGICA DE AGRUPACIÓN PARA COMBATE ---
		if data.type_evento == "accion_combate":
			handler.procesar(data)
			
			var j = i + 1
			while j < eventos_secuenciales.size() and eventos_secuenciales[j].type_evento == "accion_combate":
				handler.procesar(eventos_secuenciales[j])
				j += 1

			i = j
			
			await handler.iniciar_y_esperar()
			
		else:
			if handler.has_method("procesar_async"):
				await handler.procesar_async(data)
			else:
				handler.procesar(data)
			i += 1
	
	_procesar_cola_mensajes()

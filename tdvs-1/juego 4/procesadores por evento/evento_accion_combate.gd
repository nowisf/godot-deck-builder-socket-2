extends Resource
class_name EventoAccionCombate

signal animacion_terminada

# --- CONSTANTES DE TIEMPO ---
const DURACION_ACERCAMIENTO = 0.2
const DURACION_HIT_STOP = 0.1
const DURACION_RETORNO = 0.4
const DURACION_MAXIMA_PERMITIDA = 1 # Si la animación dura más que esto, se acelera

var fichas
var cola_eventos: Array = []
var is_animando: bool = false
var multiplicador_velocidad: float = 1.0

func _init(nFichas):
	self.fichas = nFichas

# --- SISTEMA ASÍNCRONO ---

func iniciar_y_esperar():
	if cola_eventos.size() > 0:
		calcular_y_ajustar_velocidad()
		
	if not is_animando:
		_procesar_siguiente_en_cola()
	
	while is_animando or not cola_eventos.is_empty():
		await animacion_terminada

func procesar(evento):
	cola_eventos.append(evento)
	
	if not is_animando:
		_procesar_siguiente_en_cola()

func _procesar_siguiente_en_cola():
	if cola_eventos.is_empty():
		is_animando = false
		# Restauramos velocidad normal al terminar por seguridad
		multiplicador_velocidad = 1.0 
		animacion_terminada.emit() 
		return

	is_animando = true
	var evento_actual = cola_eventos.pop_front()

	match evento_actual["tipoAnimacion"]:
		"CHOQUE_MELEE":
			var atacante = fichas.get(evento_actual["atacanteId"])
			
			if is_instance_valid(atacante):
				reproducir_choque_melee(atacante, evento_actual["impactos"])
				await animacion_terminada
			else:
				await Engine.get_main_loop().process_frame

		_:
			await Engine.get_main_loop().process_frame

	_procesar_siguiente_en_cola()

# --- LÓGICA DE VELOCIDAD ---

func calcular_y_ajustar_velocidad():
	var tiempo_total_estimado = 0.0
	
	# Predecimos cuánto tardarán todos los eventos pendientes en la cola actual
	for evento in cola_eventos:
		match evento["tipoAnimacion"]:
			"CHOQUE_MELEE":
				var cantidad_impactos = evento["impactos"].size()
				# Fórmula: (Ir + Pausa) * impactos + Volver
				var tiempo_evento = (DURACION_ACERCAMIENTO + DURACION_HIT_STOP) * cantidad_impactos + DURACION_RETORNO
				tiempo_total_estimado += tiempo_evento
	
	# Si el tiempo supera el límite, calculamos el factor de aceleración
	if tiempo_total_estimado > DURACION_MAXIMA_PERMITIDA:
		multiplicador_velocidad = tiempo_total_estimado / DURACION_MAXIMA_PERMITIDA
		print("Animación larga detectada (", tiempo_total_estimado, "s). Acelerando x", multiplicador_velocidad)
	else:
		multiplicador_velocidad = 1.0

# --- ANIMACIÓN ---

func reproducir_choque_melee(atacante: Node2D, lista_impactos: Array):
	if not is_instance_valid(atacante) or not atacante.is_inside_tree():
		animacion_terminada.emit()
		return

	var posicion_original = atacante.global_position
	var tween = atacante.create_tween()
	
	# APLICAR VELOCIDAD CALCULADA
	tween.set_speed_scale(multiplicador_velocidad)
	
	tween.set_parallel(false) 
	
	var hubo_objetivos = false

	for i in range(lista_impactos.size()):
		var victima_id = lista_impactos[i]["victimaId"]
		
		if not fichas.has(victima_id): continue
		var victima_node: FichaEscalable = fichas[victima_id]
		if not is_instance_valid(victima_node): continue
		
		hubo_objetivos = true

		# 1. ACERCAMIENTO (Usando constante)
		var direccion = (victima_node.global_position - atacante.global_position).normalized()
		var punto_impacto = victima_node.global_position - (direccion * 40.0)
		
		tween.tween_property(atacante, "global_position", punto_impacto, DURACION_ACERCAMIENTO)\
			.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
		
		# 2. IMPACTO
		tween.tween_callback(func():
			if is_instance_valid(victima_node):
				var daño_acumulado = 0
				for resultado in lista_impactos[i]["resultados"]:
					match resultado["tipo"]:
						"DAÑO": daño_acumulado += resultado["valor"]
				
				if daño_acumulado > 0:
					victima_node.dañar(daño_acumulado)
				_shake_ficha(victima_node)
		)
		
		# PAUSA (Usando constante)
		tween.tween_interval(DURACION_HIT_STOP)

	# 3. RETORNO (Usando constante)
	if hubo_objetivos:
		tween.tween_property(atacante, "global_position", posicion_original, DURACION_RETORNO)\
			.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

	tween.tween_callback(func(): animacion_terminada.emit())

func _shake_ficha(nodo: Node2D):
	if not is_instance_valid(nodo): return
	var shake_tween = nodo.create_tween()
	# El shake también se ve afectado por la velocidad si queremos, 
	# pero a veces es mejor dejarlo a velocidad normal para que se note.
	# Si quisieras acelerarlo también: shake_tween.set_speed_scale(multiplicador_velocidad)
	
	var pos_base = nodo.position
	shake_tween.tween_property(nodo, "position", pos_base + Vector2(5,0), 0.05)
	shake_tween.tween_property(nodo, "position", pos_base - Vector2(5,0), 0.05)
	shake_tween.tween_property(nodo, "position", pos_base, 0.05)

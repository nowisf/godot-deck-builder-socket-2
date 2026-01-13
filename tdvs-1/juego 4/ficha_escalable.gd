extends Node2D
class_name FichaEscalable

signal borrando()

const BASE_CASILLA_FICHA_ENEMIGA = preload("uid://cnykyy4ejmble")
const NUMERO_FLOTANTE_SCENE = preload("uid://ld6mib27jkyu")

@onready var vida_progress_bar: ProgressBar = $"ficha/Vida ProgressBar"
@onready var ficha: Sprite2D = $ficha
@onready var base: Sprite2D = $base

@export var bando:CasillaEscalable.Bandos = CasillaEscalable.Bandos.ALIADO



var ficha_resource:FichaResource
var ficha_instancia_data:FichaInstanciaData

var tween_movimiento:Tween
var tween_escalado_base: Tween
var tween_escalado_ficha: Tween

var DEMORA_MOVIMIENTO = 1

func _ready() -> void:
	if !ficha_instancia_data:
		return
	set_progress_var_value()
	set_ficha_resource(ficha_instancia_data.ficha_base)
	if ficha_instancia_data.bando == CasillaEscalable.Bandos.ENEMIGO:
		hacer_enemiga()

func set_progress_var_value():
	var vida_actual = ficha_instancia_data["stats"]["vidaActual"]
	var vida_max = ficha_instancia_data["stats"]["vidaMax"]
	var porcentage =  obtener_porcentaje_vida(vida_actual,vida_max)
	vida_progress_bar.value = porcentage


func establecer_ficha_instancia_data(nuevo_FID:FichaInstanciaData):
	ficha_instancia_data = nuevo_FID


func obtener_porcentaje_vida(vida_actual: float, vida_max: float) -> int:
	if vida_max <= 0:
		return 0
		
	return int((vida_actual / vida_max) * 100)


func dañar(daño:int):
	ficha_instancia_data["stats"]["vidaActual"] -= daño
	set_progress_var_value()
	
	valor_flotante(str(daño))
	

func valor_flotante(valor: String, color: Color = Color.RED):
	var texto_flotante: NumeroFlotanteScene = NUMERO_FLOTANTE_SCENE.instantiate()
	
	get_tree().root.add_child(texto_flotante)
	texto_flotante.global_position = self.global_position + Vector2(0, -10)

	texto_flotante.setup_and_play(valor, color)

func hacer_enemiga():
	ficha.flip_h = true
	base.texture = BASE_CASILLA_FICHA_ENEMIGA
	bando = CasillaEscalable.Bandos.ENEMIGO

func set_ficha_sprite(texture:Texture2D):
	ficha.texture = texture
	Utils.escalar_sprite_a(ficha,base.texture.get_size().x)
	
func set_ficha_resource(ficha_resouerce_nuevo:FichaResource):
	ficha_resource = ficha_resouerce_nuevo

	set_ficha_sprite(ficha_resouerce_nuevo.imagenFicha)
	
func movimiento_local(destino):
	if tween_movimiento and tween_movimiento.is_running():
		tween_movimiento.kill()
	tween_movimiento = TweensPersonalizados.mover_local(self, destino, DEMORA_MOVIMIENTO)

func movimiento_global(destino_global):
	if tween_movimiento and tween_movimiento.is_running():
		tween_movimiento.kill()
	tween_movimiento = TweensPersonalizados.mover_global(self,destino_global, DEMORA_MOVIMIENTO)

func escalar_a_objetivo(objetivo):
	if tween_escalado_base and tween_escalado_base.is_running():
		tween_escalado_base.kill()

	if tween_escalado_ficha and tween_escalado_ficha.is_running():
		tween_escalado_ficha.kill()

	tween_escalado_base = TweensPersonalizados.escalar_a(
		base,
		objetivo,
		DEMORA_MOVIMIENTO
	)

	tween_escalado_ficha = TweensPersonalizados.escalar_a(
		ficha,
		objetivo,
		DEMORA_MOVIMIENTO
	)

func get_size():
	return base.texture.get_size()


func perder_vicion(demora = 0.5, duracion = 0.8):
	print("ficha perder vicion: ",ficha_resource.nombre)
	var tween_fade = create_tween()
	tween_fade.tween_interval(demora) 
	tween_fade.tween_property(self, "modulate:a", 0.0, duracion)
	borrando.emit()
	tween_fade.tween_callback(testqq)

func testqq():
	print("ficha perder vicion testqq: ",ficha_resource.nombre)
	queue_free()

func animacion_muerte_pieza_tablero():
	var tween = ficha.create_tween()
	tween.set_parallel(true)
	tween.set_ease(Tween.EASE_OUT)
	tween.set_trans(Tween.TRANS_BOUNCE) # Efecto de rebote
	
	# 1. Rotar 90 grados (caer de lado)
	var angulo_caida = 90 if randf() > 0.5 else -90 # Aleatorio izq o der
	tween.tween_property(self, "rotation_degrees", angulo_caida, 0.6)
	
	# 2. Mover ligeramente hacia el lado de la caída y abajo (ajuste visual)
	var offset_x = 10 if angulo_caida > 0 else -10
	tween.tween_property(self, "position", position + Vector2(offset_x, 5), 0.6)
	
	# 3. Oscurecer la pieza (como si quedara inerte)
	tween.tween_property(self, "modulate", Color.GRAY, 0.6)
	
	# 4. Desvanecer al final (encadenado para que pase despues del rebote)
	var tween_fade = create_tween()
	tween_fade.tween_interval(0.5) # Esperar un poco en el suelo
	tween_fade.tween_property(self, "modulate:a", 0.0, 0.6)
	print("wwwaaa muerte")
	
	borrando.emit()
	tween_fade.tween_callback(queue_free)

extends Resource
class_name TweensPersonalizados


static func aparecer(sprite: Sprite2D, duracion: float = 0.3) -> void:
	sprite.visible = true
	sprite.modulate.a = 0.0

	sprite.create_tween().tween_property(
		sprite,
		"modulate:a",
		1.0,
		duracion
	)

static func desaparecer(sprite: Sprite2D, duracion: float = 0.3) -> void:
	var tween := sprite.create_tween()
	tween.tween_property(
		sprite,
		"modulate:a",
		0.0,
		duracion
	)
	tween.finished.connect(func():
		sprite.visible = false
	)

static func escalar_a(
	sprite: Sprite2D,
	tamaño_px: float,
	duracion: float = 0.25
) -> Tween:
	if sprite.texture == null:
		return
	var tamaño_original := sprite.texture.get_size().x
	var factor := tamaño_px / tamaño_original
	var tween = sprite.create_tween()
	tween.tween_property(
		sprite,
		"scale",
		Vector2(factor, factor),
		duracion
	)
	return tween


static func escalar_pop(
	sprite: Sprite2D,
	escala_final: Vector2 = Vector2.ONE,
	pop: float = 1.1,
	duracion: float = 0.25
) -> void:
	var tween := sprite.create_tween()
	tween.tween_property(
		sprite,
		"scale",
		escala_final * pop,
		duracion * 0.6
	)
	tween.tween_property(
		sprite,
		"scale",
		escala_final,
		duracion * 0.4
	)
	

static func mover_local(
	nodo: Node2D,
	destino_local: Vector2,
	duracion: float = 0.25
) -> Tween:
	var tween := nodo.create_tween()
	tween.set_trans(Tween.TRANS_SINE)
	tween.set_ease(Tween.EASE_IN_OUT)

	tween.tween_property(
		nodo,
		"position",
		destino_local,
		duracion
	)
	return tween

static func mover_global(
	nodo: Node2D,
	destino_global: Vector2,
	duracion: float = 0.3
) -> Tween:
	if not nodo:
		return null

	var tween := nodo.create_tween()
	tween.tween_property(
		nodo,
		"global_position",
		destino_global,
		duracion
	).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)

	return tween

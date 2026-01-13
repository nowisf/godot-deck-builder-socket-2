extends Node2D
class_name NumeroFlotanteScene


@onready var label = $Label

func setup_and_play(valor: String, color: Color):

	label.text = valor
	label.modulate = color
	
	scale = Vector2(1.5, 1.5)
	
	var random_x = randf_range(-30, 30)
	var altura_final = -10.0 # Qué tanto sube
	
	var tween = create_tween()
	tween.set_parallel(true) 
	
	tween.tween_property(self, "position", position + Vector2(random_x, altura_final), 0.8)\
		.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.3)\
		.set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
	
	tween.tween_property(self, "modulate:a", 0.0, 3)\
		.set_delay(0.5)
	
	tween.chain().tween_callback(queue_free)

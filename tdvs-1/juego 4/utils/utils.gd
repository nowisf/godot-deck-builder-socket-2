extends Resource
class_name Utils


static func escalar_sprite_a(sprite: Sprite2D, tamaño_px: float) -> void:
	if sprite.texture == null:
		return

	var tamaño_original := sprite.texture.get_size().x
	var factor := tamaño_px / tamaño_original
	sprite.scale = Vector2(factor, factor)

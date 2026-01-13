extends Control
class_name  FichaJuegoVista

const BASE_CASILLA_FICHA_ENEMIGA = preload("uid://bkaqcrglphgv1")
@onready var base: TextureRect = $Base
@onready var ficha: Sprite2D = $Ficha

func hacer_enemiga():
	ficha.flip_h = true
	base.texture = BASE_CASILLA_FICHA_ENEMIGA

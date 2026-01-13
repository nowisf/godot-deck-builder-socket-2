extends Label
func _ready() -> void:
	GlobalData.set_para_combatir_escogido.connect(_set_combate_escogido)

func _set_combate_escogido(sett:SetResource):
	if sett:
		text = sett.nombre
		return
	text = ""

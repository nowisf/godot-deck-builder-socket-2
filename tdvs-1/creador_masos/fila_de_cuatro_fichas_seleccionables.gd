extends HBoxContainer
class_name FilaDeCuatroFichasSeleccionables
signal casilla_ficha_escogible_clickeado(casillaFichaEscogible:CasillaFichaEscogible)

@onready var casillas: Array[CasillaFichaEscogible] = [$CasillaFichaEscogible,
$CasillaFichaEscogible2,
$CasillaFichaEscogible3,
$CasillaFichaEscogible4]

func colocar_fichas(fichas:Array):
	assert(fichas.size() <= 4 , "Las filas de Cuatro seleccionables no pueden contener mas de 4 fichas")
	var fichasAñadidas = 0
	for ficha:FichaResource in fichas:
		var casilla = casillas[fichasAñadidas]
		casilla.asignarFicha(ficha)
		casilla.clickeado.connect(_on_casilla_ficha_escogible_clickeado)
		fichasAñadidas+=1


func _on_casilla_ficha_escogible_clickeado(casillaFichaEscogible: CasillaFichaEscogible) -> void:
	casilla_ficha_escogible_clickeado.emit(casillaFichaEscogible)

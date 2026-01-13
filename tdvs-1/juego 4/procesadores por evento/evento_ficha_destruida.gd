extends Resource
class_name EventoFichaDestruida


var fichas
func _init(nfichas):
	fichas = nfichas

func procesar(evento):
	print("wwwaaa muerte evento")
	var ficha_muerta: FichaEscalable =fichas[evento["fichaId"]]
	
	ficha_muerta.animacion_muerte_pieza_tablero()

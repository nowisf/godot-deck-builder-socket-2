extends Resource
class_name EventoFichaMovida

var tablero :TableroJuego
var fichas

func _init(nTablero:TableroJuego, nFichas):
	self.tablero = nTablero
	self.fichas = nFichas
	

func procesar(evento):
	var _casillaActual = evento.casillaActual
	var casillaSiguiente = Vector2i(evento.siguiente.x,evento.siguiente.y)
	var fichaData = evento.fichaDTO
	
	
	tablero.mover_ficha_a(fichas[fichaData.id],casillaSiguiente)
	

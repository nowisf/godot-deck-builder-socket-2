extends Resource
class_name EventoDescubrirBaseCasilla


var tablero :TableroJuego

func _init(nTablero:TableroJuego):
	self.tablero = nTablero

func procesar(evento):
	var coords = Vector2i(evento.coords.x,evento.coords.y)
	tablero.cambiar_base_casilla(coords, evento.nombre_valdosa)
	

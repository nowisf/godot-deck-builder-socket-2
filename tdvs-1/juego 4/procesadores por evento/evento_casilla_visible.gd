extends Resource
class_name EventoVisibilidadCasilla


var tablero :TableroJuego

func _init(nTablero:TableroJuego):
	self.tablero = nTablero

func procesar(evento):
	var coords = Vector2i(evento.coords.x,evento.coords.y)
	
	print("wwwaaa ev visibilidad casilla: (casilla | bool )_ ", coords, " | ",evento.visible)
	tablero.establecer_vicion_casilla(coords,evento.visible)
	

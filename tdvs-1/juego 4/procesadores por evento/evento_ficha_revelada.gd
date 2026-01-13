extends Resource
class_name EventoFichaRevelada

var tablero :TableroJuego
var fichas : Dictionary

func _init(nTablero:TableroJuego, nfichas):
	self.tablero = nTablero
	self.fichas = nfichas

func procesar(evento):
	var ficha_instancia = FichaInstanciaData.new(evento.fichaDTO)
	if fichas.has(ficha_instancia.id):
		return
	
	var ficha:FichaEscalable = tablero.colocar_ficha_instancia(ficha_instancia)
	ficha.borrando.connect(func(): 
		fichas.erase(ficha_instancia.id)
		print("wwwaaa borrando ficha: ", ficha_instancia.id)
		)
	
	fichas[ficha_instancia.id] = ficha
	print("wwwaaa, ", ficha_instancia.id)
	print("wwwaaa, ", fichas[ficha_instancia.id])

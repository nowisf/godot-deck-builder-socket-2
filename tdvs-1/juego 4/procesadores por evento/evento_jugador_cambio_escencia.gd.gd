extends Resource
class_name EventoCambioEscencia

var hud :InterfazJuego

func _init(nhud:InterfazJuego):
	
	self.hud = nhud


func procesar(evento):
	hud.cambiar_escencia(evento.cambio_escencia)

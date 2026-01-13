extends Resource
class_name EventoAplicarEnfriamientoHabilidad


var hud :InterfazJuego
var instanciasHabilidadesPorId
func _init(nhud:InterfazJuego, ninstanciasHabilidadesPorId):
	hud = nhud
	instanciasHabilidadesPorId = ninstanciasHabilidadesPorId

func procesar(evento):

	if evento.habilidad_id not in instanciasHabilidadesPorId:
		print("HABILIDAD NO ENCONTRADA: ", evento.habilidad_id)
		print("instanciashabilidades ",instanciasHabilidadesPorId)
		print("evento " ,evento)
		return
	
	instanciasHabilidadesPorId[evento.habilidad_id].cambiar_enfriamieto(evento.cambio_enfriamiento)

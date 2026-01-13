extends Resource
class_name EventoDescontarTodosLosEnfriamientos

var hud :InterfazJuego
var instanciasHabilidadesPorId
func _init(nhud:InterfazJuego, ninstanciasHabilidadesPorId):
	instanciasHabilidadesPorId = ninstanciasHabilidadesPorId
	hud = nhud

func procesar(_evento):
	print("descontando a todos")
	for instancia_habilidad in instanciasHabilidadesPorId:
		instanciasHabilidadesPorId[instancia_habilidad].cambiar_enfriamieto(-1)

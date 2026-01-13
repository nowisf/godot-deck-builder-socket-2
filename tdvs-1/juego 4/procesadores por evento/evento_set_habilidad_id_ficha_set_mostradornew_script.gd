extends Resource
class_name EventoSetHabilidadIdFichaSetMostrador

var hud :InterfazJuego
var instanciasHabilidadesPorId

func _init(nhud:InterfazJuego, ninstanciasHabilidadesPorId):
	instanciasHabilidadesPorId = ninstanciasHabilidadesPorId
	hud = nhud


func procesar(evento):
	var ficha_mano_set:FichaManoSet = hud.get_ficha_mano_set_por_id(evento.fichaBaseId)
	ficha_mano_set.id_habilidad = evento.habilidadId
	instanciasHabilidadesPorId[evento.habilidadId] = ficha_mano_set

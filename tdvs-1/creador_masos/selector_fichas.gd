extends ScrollContainer
class_name SelectorFichas

signal casilla_ficha_escogible_clickeado(casillaFichaEscogible: CasillaFichaEscogible)

@export var fila_fichas_packed:PackedScene
@export var casillas: Array[CasillaFichaEscogible] = []
var fichas_dir:String = GlobalData.get_fichas_dir()

@onready var contenedorDeFilas = $ContenedorDeFilasFichasVBoxContainer
@export var set_resource:SetResource

func set_set_resource(nuevo_set_resource:SetResource):
	for casilla in casillas:
		casilla.cambiar_bloqueo(false)
	
	set_resource = nuevo_set_resource
	for ficha in nuevo_set_resource.slots:
		if !ficha:
			continue
		cambiar_casilla_bloqueo(ficha, true)
	set_resource.ficha_liberada.connect(_on_set_resource_ficha_liberada)
	set_resource.ficha_ocupada.connect(_on_set_resource_ficha_ocupada)

func _on_set_resource_ficha_liberada(ficha_resource:FichaResource):
	cambiar_casilla_bloqueo(ficha_resource, false)
func _on_set_resource_ficha_ocupada(ficha_resource:FichaResource):
	cambiar_casilla_bloqueo(ficha_resource, true)
			
func cambiar_casilla_bloqueo(ficha_resource:FichaResource, bloqueado:bool):
	for casilla in casillas:
		if casilla.ficha_resource ==  ficha_resource:
			casilla.cambiar_bloqueo(bloqueado)
			break

func _ready():
	GlobalData.fichas_establecidas.connect(montar)
	GlobalData.fichas_poseidas_establecidas.connect(_on_fichas_poseidas_establecidas)
	
func _on_fichas_poseidas_establecidas(_fichas_poseidas):

	montar(GlobalData.fichas)


func vaciar():
	casillas = []
	for child in contenedorDeFilas.get_children():
		print(child)
		child.queue_free()


func montar(fichas:Array[FichaResource], incluir_faltantes:bool = false):
	vaciar()
	await get_tree().process_frame
	
	if !incluir_faltantes:
		var fichas_poseidas: Array[FichaResource] = []
		for ficha in fichas:
			if ficha.id in GlobalData.fichas_poseidas:
				fichas_poseidas.append(ficha)
		fichas = fichas_poseidas

	cargar_fichas_resources(fichas)
	
	for casilla in casillas:
		if casilla.ficha_resource and !casilla.ficha_resource.id in GlobalData.fichas_poseidas:
			casilla.cambiar_faltante(true)
		if casilla.ficha_resource and casilla.ficha_resource in set_resource.slots:
			casilla.cambiar_bloqueo(true)

	while contenedorDeFilas.get_child_count() < 3:
		añadirFilaFichas([])


func desbloquearCasillaDeFicha(ficha: FichaResource):
	for child:CasillaFichaEscogible in casillas:
		if child.ficha_resource == ficha:
			child.cambiar_bloqueo(false)
			break


func cargar_fichas_resources(fichas:Array[FichaResource]):
	var recursos_cargados: Array[FichaResource] = []
	for recurso:FichaResource in fichas:
		recursos_cargados.append(recurso)
		if (recursos_cargados.size()==4 or recurso==fichas.back() ):
			añadirFilaFichas(recursos_cargados)
			recursos_cargados = []


func añadirFilaFichas(fichas:Array[FichaResource]):
	var fila_fichas:FilaDeCuatroFichasSeleccionables = fila_fichas_packed.instantiate()
	contenedorDeFilas.add_child(fila_fichas)
	fila_fichas.colocar_fichas(fichas)
	casillas.append_array(fila_fichas.casillas)
	fila_fichas.casilla_ficha_escogible_clickeado.connect(_on_fila_de_cuatro_fichas_seleccionables_casilla_ficha_escogible_clickeado)


func _on_fila_de_cuatro_fichas_seleccionables_casilla_ficha_escogible_clickeado(casillaFichaEscogible: CasillaFichaEscogible) -> void:
	casilla_ficha_escogible_clickeado.emit(casillaFichaEscogible)


func _on_mazo_ficha_liberada(ficha: FichaResource) -> void:
	desbloquearCasillaDeFicha(ficha)


func _on_faltantes_check_button_toggled(toggled_on: bool) -> void:
	montar(GlobalData.fichas, toggled_on)

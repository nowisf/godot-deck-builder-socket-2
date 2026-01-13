extends CanvasLayer
class_name ZoomLayer

@onready var sub_viewport_container: SubViewportContainer = $SubViewportContainer
@onready var sub_viewport: SubViewport = $SubViewportContainer/SubViewport
@onready var camera_2d: Camera2D = $SubViewportContainer/SubViewport/Camera2D



var CASILLAS_A_MOSTRAR = 3.0 # Queremos ver 3x3

func _ready():
	hide() # Oculto al arrancar
	sub_viewport.world_2d = get_viewport().world_2d

func abrir_con_zoom_automatico(casilla_nodo: CasillaEscalable):

	var tamano_casilla = float(casilla_nodo.tamaño_objetivo)
	sub_viewport.size = Vector2(tamano_casilla*6,tamano_casilla*6)
	
	var offset_correccion = Vector2(tamano_casilla , tamano_casilla )
	
	camera_2d.global_position = casilla_nodo.global_position - offset_correccion
	
	var tamaño_zona_mundo = tamano_casilla * CASILLAS_A_MOSTRAR
	var tamaño_ventana_ui = sub_viewport.size.x
	
	var zoom_factor = tamaño_ventana_ui / tamaño_zona_mundo
	camera_2d.zoom = Vector2(zoom_factor, zoom_factor)
	
	show()



func _on_cerrar_button_pressed() -> void:
	hide()

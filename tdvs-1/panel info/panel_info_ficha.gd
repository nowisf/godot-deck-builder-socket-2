extends PanelContainer

@onready var vida_progress_bar: ProgressBar = $"VBoxContainer/Vida ProgressBar"
@onready var vida_actual_label: Label = $"VBoxContainer/Vida ProgressBar/HBoxContainer/VidaActual Label"
@onready var vida_maxima_label: Label = $"VBoxContainer/Vida ProgressBar/HBoxContainer/VidaMaxima Label"

@onready var retrato_texture_rect: TextureRect = $"VBoxContainer/Carta TextureRect/Retrato TextureRect"
@onready var coste_label: Label = $"VBoxContainer/Carta TextureRect/Retrato TextureRect/Coste Label"

@onready var nombre_label: Label = $"VBoxContainer/Nombre Label"

extends Node


var fichas:Array[FichaResource]

const IMAGENES_PATH := "res://imagenes/"
const FICHAS_PATH := "res://Juego2/Fichas/Ejemplares/"


func actualizar_fichas(diccionario_fichas:Dictionary):
	borrar_todas_las_fichas()
	for key in diccionario_fichas.keys():
		diccionario_fichas[key].id = key
		crear_ficha(diccionario_fichas[key])


func crear_ficha(diccionario_ficha:Dictionary):
	var ficha = FichaResource.new()
	ficha.nombre = diccionario_ficha.nombre
	ficha.imagenFicha = load(IMAGENES_PATH + diccionario_ficha.imagenFicha)
	ficha.imagenSet = load(IMAGENES_PATH + diccionario_ficha.imagenSet) 
	ficha.coste = diccionario_ficha.coste
	ficha.id = diccionario_ficha.id
	
	
	
	print(diccionario_ficha)

	var file_path = FICHAS_PATH + diccionario_ficha.nombre + ".tres"
	ResourceSaver.save(ficha, file_path)
	print("✅ Personaje guardado en:", file_path)
	return ficha


func cargar_todos() -> Array[FichaResource]:
	var lista: Array[FichaResource] = []
	var dir = DirAccess.open(FICHAS_PATH)
	if dir:
		for file_name in dir.get_files():
			if file_name.ends_with(".tres"):
				var path = FICHAS_PATH + file_name
				var ficha = load(path)
				if ficha is FichaResource:
					lista.append(ficha)
	return lista


func borrar_ficha(nombre: String):
	var path = FICHAS_PATH + nombre + ".tres"
	if FileAccess.file_exists(path):
		DirAccess.remove_absolute(path)
		print("🗑️ Borrado:", path)
	else:
		print("⚠️ No existe:", path)


func borrar_todas_las_fichas():
	var dir = DirAccess.open(FICHAS_PATH)
	if dir:
		for file_name in dir.get_files():
			if file_name.ends_with(".tres"):
				var path = FICHAS_PATH + file_name
				var result = DirAccess.remove_absolute(path)
				if result == OK:
					print("🗑️ Borrado:", path)
				else:
					print("⚠️ No se pudo borrar:", path)
		fichas.clear()
		print("✅ Todas las fichas borradas.")
	else:
		print("❌ No se pudo abrir el directorio:", FICHAS_PATH)

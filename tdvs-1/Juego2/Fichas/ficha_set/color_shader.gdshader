shader_type canvas_item;

// Color que aplicaremos
uniform vec4 u_color = vec4(1.0, 1.0, 1.0, 1.0);

void fragment() {
    // Obtengo la textura base
    vec4 tex = texture(TEXTURE, UV);
    
    // Multiplico por el color
    COLOR = tex * u_color;
}

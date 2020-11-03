#ifdef GL_ES
precision highp float;
#endif 

varying vec2 vTextureCoord;  // coordenadas de textura interpoladas recebidas de VS
uniform sampler2D uSampler;  // recebe um identificador da textura a usar
uniform sampler2D uSampler2; // ordem de declaração não é importante

// Valores recebidos de Vertex Shader
varying vec4 coords; 
varying vec4 normal;

// animação
uniform float timeFactor;

void main() {
    /*
    Acede á textura apontada em uSampler nas coordenadas vTextureCoord

    gl_FragColor -> côr do fragmento no ecrã (Shader-specific output variable)
    texture2D -> Built-in function returning texel
    uSampler -> Sampler to be accessed
    vTexture Coord -> Texture coordinate to be acessed.
    */
	gl_FragColor = texture2D(uSampler, vTextureCoord);

    // Aplicar cor 
    if (coords.x > 0.0)
		gl_FragColor =  normal;
	else{
		gl_FragColor.rgb = abs(coords.xyz)/3.0;
		gl_FragColor.a = 1.0;
	}

    // Aplicar 2 texturas
    vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 filter = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);
	if (filter.b > 0.5)
		color=vec4(0.52, 0.18, 0.11, 1.0);
	
	gl_FragColor = color;

    // animação
    vec4 color = texture2D(uSampler, vTextureCoord+vec2(timeFactor*.01,0.0));
	vec4 filter = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);
	if (filter.b > 0.5)
		color=vec4(0.52, 0.18, 0.11, 1.0);
	
	gl_FragColor = color;
}

/*
// on scene init
this.testShader.setUniformsValues({uSampler2: 1});
this.texture2 = new CGFtexture(this, "textures/FEUP.jpg");

// on scene display
this.setActiveShader(this.testShader);
this.texture2.bind(1);  // se não tiver parametros é o mesmo que ter 0


Textura -> unidade de textura -> Sampler
unidades de textura: 0, 1, 2, ...
*/
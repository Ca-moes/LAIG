// informação de cada vértice
attribute vec3 aVertexPosition;  // posição [x,y,z]
attribute vec3 aVertexNormal;    // normal [x,y,z]
attribute vec2 aTextureCoord;    // coordenadas de textura [s,t] - Tex-coords input to VS

// info comum a todos os vértice
// WebCGF-provided Input Variables (uniforms)
uniform mat4 uMVMatrix; // Model View matrix - Matrix onde são aplicadas as transformações
uniform mat4 uPMatrix;  // Projection matrix - Matrix com info da camara
uniform mat4 uNMatrix;	// Normal transformation matrix - Processa a normal associada ao vértice

varying vec2 vTextureCoord; // Tex-coords output from VS to be input to FS

uniform float normScale;  // valor recebido de programa de escala da normal
// Valores a passar a Fragment Shader
varying vec4 coords;
varying vec4 normal;

//animação
uniform float timeFactor;

void main() {
    /* 
    gl_Position -> posição final no ecrã do vértice  (Shader-specific output variable)
    Multiplica as coordenadas do vertice [vec4(aVertexPosition, 1.0)]
        pela matrix da cena [uMVMatrix]
        seguida pela multiplicação pela matrix de projeção [uPMatrix]
    */
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    // Shift no vertex ao longo da normal
    vec4 vertex=vec4(aVertexPosition+aVertexNormal*normScale*0.1, 1.0);
	gl_Position = uPMatrix * uMVMatrix * vertex;
	normal = vec4(aVertexNormal, 1.0);
	coords=vertex/10.0;

	vTextureCoord = aTextureCoord;

    // Usar máscara para offset de vértices
    vec3 offset=vec3(0.0,0.0,0.0);
    if (texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord).b > 0.5)
		offset=aVertexNormal*normScale*0.1;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);

    // animação
    if (texture2D(uSampler1, vec2(0.0,0.1)+vTextureCoord).b > 0.5)
		offset=aVertexNormal*normScale*0.1*sin(timeFactor);
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);


    // Mostrar uma letra
    // multiplica as coordenadas por textura por um numero 0 < x < 1 
    // para aparecer apenas a primeira letra e dá um shift com vec2 para a letra que queremos 
    const float n_cols = 10;
    const float n_rows = 10;
    vTextureCoord = (aTextureCoord * (1.0/10.0)) + vec2(0.1, 0.2);



}

/*
// in scene's init (carrega o shader para memória)
[this.gl -> ligação á API gráfica]
this.testShader = new CGFshader(this.scene.gl, "shaders/flat.vert", "shaders/flat.frag");

//in scene's display
this.setActiveShader(thistestShader);
this.teapot.display()
this.setActiveShader(this.scene.defaultShader);

Passing values: from app to shaders
this.testShader.setUniformsValues({normScale:50.0});
*/

--------------------

/*
TIPOS DE VARIAVEIS

uniform - input to Vertex and Fragment shader from application (RO), comuns a todos os vértices
attribute - input per-vertex to Vertex shader from application (RO)
varying - output from Vertex shader (RW), interpolated, then input to Fragment shader (RO). 
            Calculados no Vertex shader e interpolados no Fragment shader
const - compile time constant (READ_ONLY)
*/

--------------------

/*
ANIMAÇÂO

init(){
    this.setUpdatePeriod(x);  // periodo minimo entre chamadas da função update
}

update(t){  
    this.testShader.setUniformsValues({timeFactor: t/100 % 1000});
}
*/
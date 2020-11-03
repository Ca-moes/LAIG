attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix; // Model.View matrix
uniform mat4 uPMatrix;  // Projection matrix
uniform mat4 uNMatrix;  // Normal transformation matrix

varying vec2 vTextureCoord;

uniform float cols; // 1.0/cols
uniform float rows; // 1.0/rows
uniform float m;    // m/cols - indice a começar em 0
uniform float n;    // n/cols - indice a começar em 0

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vec2 focus = vec2(cols,rows); // se não tiver shift foca no primeiro elemento
    vec2 shift = vec2(m, n);     // dá shift para o elemento que queremos
    vTextureCoord = (aTextureCoord * focus) + shift;
}
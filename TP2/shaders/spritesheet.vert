attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix; // Model.View matrix
uniform mat4 uPMatrix;  // Projection matrix
uniform mat4 uNMatrix;    // Normal transformation matrix

varying vec2 vTextureCoord;

uniform float cols;
uniform float rows;
uniform float m; // indice a começar em 0
uniform float n; // indice a começar em 0

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = (aTextureCoord * vec2(1.0/cols,1.0/rows)) + vec2(m/cols, n/rows);
}
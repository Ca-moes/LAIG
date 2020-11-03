attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix; // Model.View matrix
uniform mat4 uPMatrix;  // Projection matrix
uniform mat4 uNMatrix;    // Normal transformation matrix

varying vec2 vTextureCoord;

void main() {

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    const float n_total_cols = 1.0;
    const float n_total_rows = 1.0;
    const float m = 0.0; // indice a começar em 0
    const float n = 0.0; // indice a começar em 0
    vTextureCoord = (aTextureCoord * vec2(1.0/n_total_cols,1.0/n_total_rows)) + vec2(m/n_total_cols, n/n_total_rows);

}
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;  // coordenadas de textura interpoladas recebidas de VS
uniform sampler2D uSampler;  // recebe um identificador da textura a usar

uniform float progress;

void main() {
    if (vTextureCoord[0] <= progress) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
    }
}
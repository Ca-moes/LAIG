#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;  // coordenadas de textura interpoladas recebidas de VS
uniform sampler2D uSampler;  // recebe um identificador da textura a usar

uniform float timeFactor;


void main() {
    float offset = 0.2*sin(timeFactor*0.1) + 1.0;
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(0.275*gl_FragColor.x, 0.412*gl_FragColor.y, offset, 1.0);
}
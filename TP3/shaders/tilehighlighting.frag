#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;  // coordenadas de textura interpoladas recebidas de VS
uniform sampler2D uSampler;  // recebe um identificador da textura a usar

uniform float timeFactor;
uniform vec3 colors;


void main() {
    float offset = 0.2*sin(timeFactor*0.1) + 1.0;
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(colors.x*gl_FragColor.x, colors.y*gl_FragColor.y, colors.z*offset, 1.0);
}
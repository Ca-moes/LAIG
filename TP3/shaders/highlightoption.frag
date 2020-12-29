#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;// coordenadas de textura interpoladas recebidas de VS
uniform sampler2D uSampler;// recebe um identificador da textura a usar
uniform sampler2D uSampler2;// ordem de declaração não é importante

void main() {
    float maxX = 1.0 - 0.02;
    float minX = 0.02;
    float maxY = maxX;
    float minY = minX;

    if (vTextureCoord.x < maxX && vTextureCoord.x > minX &&
    vTextureCoord.y < maxY && vTextureCoord.y > minY) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    //gl_FragColor = texture2D(uSampler, vTextureCoord);
}
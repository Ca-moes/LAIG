#version 300 es
precision highp float;

in vec4 vFinalColor;
out vec4 fragColor;

uniform float timeFactor;

void main() {
    float offset = 0.2 * sin(timeFactor * 0.2) + 1.0;

    fragColor = vec4(vFinalColor.rgb * offset, vFinalColor.w);
}
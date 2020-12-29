class MySpriteSheet {
    /**
     * carrega a textura e respetivas dimensões, bem como o shader associado.
     * @param {XMLscene} scene
     * @param {String} textPath
     */
    constructor(scene, textPath, sizeM, sizeN) {
        this.scene = scene;
        this.texture = new CGFtexture(this.scene, textPath);
        this.scene.shaderAppearance.setTexture(this.texture);

        this.sizeM = sizeM;
        this.sizeN = sizeN;


        this.scene.spriteShader.setUniformsValues({uSampler: 0});

    }

    activate() {
        this.scene.setActiveShaderSimple(this.scene.spriteShader);
        this.texture.bind(0);
        this.scene.spriteShader.setUniformsValues({cols: 1 / this.sizeM}); // divisor para focar na primeira dvisão
        this.scene.spriteShader.setUniformsValues({rows: 1 / this.sizeN});
    }

    /**
     * “ativa” a célula de coordenadas (m, n).
     * Para isso, deve ativar a textura e o shader, e definir os parâmetros do shader de acordo com as coordenadas de entrada.
     * @param {*} m eixo dos x
     * @param {*} n eixo dos y
     */
    activateCellMN(m, n) {
        // Passar a .vert shader as coordenadas de textura, que vão ser passadas a varying vec2 vTextureCoord;
        this.scene.spriteShader.setUniformsValues({m: m / this.sizeM}); // ratio em relação a tudo
        this.scene.spriteShader.setUniformsValues({n: n / this.sizeN});
    }

    /**
     * ativa a célula na posição p, assumindo que a numeração das células começa em 0 no canto superior esquerdo da textura e avança da esquerda para a direita,
     *  e de cima para baixo (ver figura 2). Este método pode recorrer ao anterior.
     * @param {*} p
     */
    activateCellP(p) {
        this.activateCellMN(p % this.sizeM, Math.floor(p / this.sizeM));
    }
}
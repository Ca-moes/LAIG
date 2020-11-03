class MySpriteSheet {
    /**
     * carrega a textura e respetivas dimensões, bem como o shader associado.
     * 
     * @param {*} texture 
     * @param {*} sizeM 
     * @param {*} sizeN 
     */
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = new CGFtexture(this.scene, texture);
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.testShader = new CGFshader(this.scene.gl, "shaders/spritesheet.vert", "shaders/spritesheet.frag");
        this.testShader.setUniformsValues({cols:1/this.sizeM}); // divisor para focar na primeira dvisão
        this.testShader.setUniformsValues({rows:1/this.sizeN});
        this.testShader.setUniformsValues({uSampler: 0});
    }   

    /**
     * “ativa” a célula de coordenadas (m, n). 
     * Para isso, deve ativar a textura e o shader, e definir os parâmetros do shader de acordo com as coordenadas de entrada.
     * @param {*} m eixo dos x
     * @param {*} n eixo dos y
     */
    activateCellMN(m, n){
        // Passar a .vert shader as coordenadas de textura, que vão ser passadas a varying vec2 vTextureCoord;
        this.testShader.setUniformsValues({m:m/this.sizeM}); // ratio em relação a tudo
        this.testShader.setUniformsValues({n:n/this.sizeN});
    }

    /**
     * ativa a célula na posição p, assumindo que a numeração das células começa em 0 no canto superior esquerdo da textura e avança da esquerda para a direita,
     *  e de cima para baixo (ver figura 2). Este método pode recorrer ao anterior.
     * @param {*} p 
     */
    activateCellP(p){
        this.activateCellMN(p%this.sizeM, Math.floor(p/this.sizeN));
    }
}
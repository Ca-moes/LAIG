class MySpriteSheet {
    /**
     * carrega a textura e respetivas dimensões, bem como o shader associado.
     * 
     * @param {*} texture 
     * @param {*} sizeM 
     * @param {*} sizeN 
     */
    constructor(scene, texture, sizeM, sizeN){
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.scene = scene;

        this.testShader = new CGFshader(this.scene.gl, "shaders/test.vert", "shaders/test.frag");
    }

    /**
     * “ativa” a célula de coordenadas (m, n). 
     * Para isso, deve ativar a textura e o shader, e definir os parâmetros do shader de acordo com as coordenadas de entrada.
     * @param {*} m 
     * @param {*} n 
     */
    activateCellMN(m, n){
        // Passar a .vert shader as coordenadas de textura, que vão ser passadas a varying vec2 vTextureCoord;
    }

    /**
     * ativa a célula na posição p, assumindo que a numeração das células começa em 0 no canto superior esquerdo da textura e avança da esquerda para a direita,
     *  e de cima para baixo (ver figura 2). Este método pode recorrer ao anterior.
     * @param {*} p 
     */
    activateCellP(p){
        this.activateCellMN(p%this.sizeM, p/this.sizeN);
    }
}
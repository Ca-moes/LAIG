/**
 * Implemente uma classe MySpriteText para renderizar em 3D uma string de texto suportada por spritesheets. 
 * Esta classe deve receber como argumento a string desejada, e renderizar a mesma numa geometria, 
 * mapeando os caracteres a partir de uma spritesheet específica da aplicação e carregada explicitamente no código
 * (ou seja, não é definida/dependente do ficheiro LSF, mas da aplicação). 
 * A spritesheet será carregada dentro de uma instância da classe MySpritesheet.
 */
class MySpriteText{
    /**
     * recebe a string a ser representada, cria a geometria (sugestão: MyRectangle, para criar quadrado) onde os caracteres serão mapeados, e inicializa a spritesheet.
     * @param {*} scene 
     * @param {*} text 
     */
    constructor(scene, text){
        this.scene = scene
        this.string = text
        this.spritesheet = new MySpriteSheet(scene, "./shaders/font_16x16.png", 16, 16)
        this.square = new MyRectangle(this.scene, 0, 0, 1, 1)

        this.updatedTexCoords = true; // no need for updateTexCoords
    }

    /**
     * função auxiliar que recebe o caracter a ser renderizado, e devolve a posição da sprite correspondente na grelha da spritesheet.
     * Retorna apenas index do caracter, calcula-se as coordenadas:
     * 
     * coords (m,n)-> position(x) (em 16x16)
     * 16*n + m = x --> (4,1) -> 65
     * position (x) -> coords (m,n) (em 16x16)
     * x%16 = m; x/16 = n
     * @param {*} character 
     */
    getCharacterPosition(character){
        const maping = {
        '0':48, '1':49, '2':50, '3':51, '4':52, '5':53, '6':54, '7':55, '8':56, '9':57, 
        'A':65, 'B':66, 'C':67, 'D':65};
        return maping[character];
    }

    /**
     * função de desenho (a ser chamada durante o desenho do grafo), na qual a geometria criada será desenhada repetidamente para cada caracter. 
     * Cada caracter será mapeado na geometria utilizando a função MySpritesheet.activateCellP().
     */
    display(){
        this.scene.setActiveShader(this.spritesheet.testShader);
        this.spritesheet.texture.bind(0);
        
        this.scene.translate(-this.string.length/2, -0.5, 0);

        [...this.string].forEach(c => {
            this.spritesheet.activateCellP(this.getCharacterPosition(c));
            this.square.display()
            this.scene.translate(1,0,0);
        })

        this.scene.setActiveShader(this.scene.defaultShader)
    }

}
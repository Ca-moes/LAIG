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
        this.scene = scene;
        this.string = text;

        // TODO inicializar MyRectangle e MySpriteSheet
    }

    /**
     * função auxiliar que recebe o caracter a ser renderizado, e devolve a posição da sprite correspondente na grelha da spritesheet.
     * Retorna apenas index do caracter, calcula-se as coordenadas:
     * 
     * coords (m,n)-> position(x) (em 16x16)
     * 16*m + n = x --> (4,1) -> 65
     * position (x) -> coords (m,n) (em 16x16)
     * x%16 = m; x/16 = n
     * @param {*} character 
     */
    getCharacterPosition(character){
        const maping = [];
        maping['A'] = 65;
        maping['B'] = 66;
        return maping[character];
    }

    /**
     * função de desenho (a ser chamada durante o desenho do grafo), na qual a geometria criada será desenhada repetidamente para cada caracter. 
     * Cada caracter será mapeado na geometria utilizando a função MySpritesheet.activateCellP().
     */
    display(){
        /*
        aplica textura
        display retangulo
        shift
        repeat
        */
    }

    /** 
     * TODO:
     * Adicione suporte na aplicação a um novo tipo de primitiva - spritetext - e adicione uma ou mais instâncias dessa primitiva no ficheiro de cena 
     * (ver extensão ao LSF no final do enunciado)
     * <leaf type=”spritetext” text=”ss” />    
    */
}
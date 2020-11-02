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
    }

    /**
     * função auxiliar que recebe o caracter a ser renderizado, e devolve a posição da sprite correspondente na grelha da spritesheet.
     * @param {*} character 
     */
    getCharacterPosition(character){
        return {
            coords : {
                m: 1,
                n: 1
            },
            position : 1
        };
    }

    /**
     * função de desenho (a ser chamada durante o desenho do grafo), na qual a geometria criada será desenhada repetidamente para cada caracter. 
     * Cada caracter será mapeado na geometria utilizando a função MySpritesheet.activateCellP().
     */
    display(){

    }

    /** 
     * TODO:
     * Adicione suporte na aplicação a um novo tipo de primitiva - spritetext - e adicione uma ou mais instâncias dessa primitiva no ficheiro de cena (ver extensão ao LSF no final do enunciado)
     * <leaf type=”spritetext” text=”ss” />    
    */
}
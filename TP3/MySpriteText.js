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
     * @param {*} character 
     */
    getCharacterPosition(character){
        const maping = {
        ' ':32,
        '0':48, '1':49, '2':50, '3':51, '4':52, '5':53, '6':54, '7':55, '8':56, '9':57, ':':58, ';':59, '<':60, '=':61, '>':62, '?':63,
        '@':64, 'A':65, 'B':66, 'C':67, 'D':68, 'E':69, 'F':70, 'G':71, 'H':72, 'I':73, 'J':74, 'K':75, 'L':76, 'M':77, 'N':78, 'O':79,
        'P':80, 'Q':81, 'R':82, 'S':83, 'T':84, 'U':85, 'V':86, 'W':87, 'X':88, 'Y':89, 'Z':90, '[':91,'\\':92, ']':93, '^':94, '_':95,
        '`':96, 'a':97, 'b':98, 'c':99, 'd':100, 'e':101, 'f':102, 'g':103, 'h':104, 'i':105, 'j':106, 'k':107, 'l':108, 'm':109, 'n':110, 'o':111,
        'p':112, 'q':113, 'r':114, 's':115, 't':116, 'u':117, 'v':118, 'w':119, 'x':120, 'y':121, 'z':122,
        };
        return maping[character];
    }

    /**
     * função de desenho (a ser chamada durante o desenho do grafo), na qual a geometria criada será desenhada repetidamente para cada caracter. 
     * Cada caracter será mapeado na geometria utilizando a função MySpritesheet.activateCellP().
     */
    display(){
        this.spritesheet.activate()
        this.scene.pushMatrix()
        this.scene.translate(-this.string.length/2, -0.5, 0);
        [...this.string].forEach(c => {
            this.spritesheet.activateCellP(this.getCharacterPosition(c));
            this.square.display()
            this.scene.translate(1,0,0);
        })
        this.scene.popMatrix()
        this.scene.setActiveShader(this.scene.defaultShader)
    }

}
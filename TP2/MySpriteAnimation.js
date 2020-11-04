/**
 * Implemente uma classe MySpriteAnimation para representar uma animação baseada em sprites. 
 * Dada uma spritesheet, uma célula de início e de fim, e um período de tempo para a animação, 
 * a classe deve ir alterando a célula da spritesheet usada em função do tempo para criar uma animação em ciclo 
 * (sugestão: usar uma função update()).
 */
class MySpriteAnimation extends Animation{
    /**
     * @param {*} scene 
     * @param {*} spritesheet id or reference to MySpriteSheet
     * @param {*} initial index of first sprite
     * @param {*} final index of last sprite
     * @param {Float} period seconds
     */
    constructor(scene, spritesheet, initial, final, period){
        this.scene = scene;
        this.initial = initial;
        this.final = final;
        this.period = period;

        this.spritesheet = new MySpriteSheet(scene);
        this.square = new MyRectangle(this.scene, 0, 0, 1, 1)

        this.index = initial;
    }

    /**
     * 1. Calculate elapsed time
     * 2. calculate which sprite cell is active
     *      using elapsed time, duration, nº of cells
     * 3. save current state & other variables
     *      index of current sprite
     */
    update(t){
        // initial: 3    final: 8
        // 3 4 5 6 7 8
        // period: 5 secs
        // 8 - 3 = 5
        // 1 sec
    }

    display(){
        this.scene.setActiveShader(this.spritesheet.testShader);
        this.spritesheet.texture.bind(0);
        
        this.spritesheet.activateCellP(this.index);
        this.square.display()

        this.scene.setActiveShader(this.scene.defaultShader)
    }
}
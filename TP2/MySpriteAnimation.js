/**
 * Implemente uma classe MySpriteAnimation para representar uma animação baseada em sprites. 
 * Dada uma spritesheet, uma célula de início e de fim, e um período de tempo para a animação, 
 * a classe deve ir alterando a célula da spritesheet usada em função do tempo para criar uma animação em ciclo 
 * (sugestão: usar uma função update()).
 */
class MySpriteAnimation extends Animation{
    /**
     * @param {*} scene 
     * @param {MySpriteSheet} spritesheet id or reference to MySpriteSheet
     * @param {*} initial index of first sprite
     * @param {*} final index of last sprite
     * @param {Float} period seconds
     */
    constructor(scene, spritesheet, initial, final, period){
        super(0,0,0,0)
        this.scene = scene;
        this.initial = initial;
        this.final = final;
        this.period = period;

        this.spritesheet = spritesheet
        this.square = new MyRectangle(this.scene, 0, 0, 1, 1)

        this.index = initial;
        this.deltaTime = period/(final-initial);
        this.lastUpdate = 0;

        this.updatedTexCoords = true; // no need for updateTexCoords
    }

    /**
     * 1. Calculate elapsed time
     * 2. calculate which sprite cell is active
     *      using elapsed time, duration, nº of cells
     * 3. save current state & other variables
     *      index of current sprite
     */
    update(t){
        if (t - this.lastUpdate >= this.deltaTime) {
            this.index = this.index+1
            this.lastUpdate = t
        }
        if (this.index == this.final + 1) 
            this.index = this.initial
    }

    display(){
        this.spritesheet.activate()
        
        this.spritesheet.activateCellP(this.index);
        this.square.display()

        this.scene.setActiveShader(this.scene.defaultShader)
    }
}
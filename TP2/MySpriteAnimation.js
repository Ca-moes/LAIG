/**
 * Implemente uma classe MySpriteAnimation para representar uma animação baseada em sprites. 
 * Dada uma spritesheet, uma célula de início e de fim, e um período de tempo para a animação, 
 * a classe deve ir alterando a célula da spritesheet usada em função do tempo para criar uma animação em ciclo 
 * (sugestão: usar uma função update()).
 */
class MySpriteAnimation{
    /**
     * 
     * @param {*} scene 
     * @param {*} spritesheet id or reference to MySpriteSheet
     * @param {*} initial index of first sprite
     * @param {*} final index of last sprite
     * @param {FLoat} period seconds
     */
    constructor(scene, spritesheet, initial, final, period){
        this.scene = scene;
        this.spritesheet = spritesheet;
        this.initial = initial;
        this.final = final;
        this.period = period;
    }
}
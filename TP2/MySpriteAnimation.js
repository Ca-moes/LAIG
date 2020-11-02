/**
 * Implemente uma classe MySpriteAnimation para representar uma animação baseada em sprites. 
 * Dada uma spritesheet, uma célula de início e de fim, e um período de tempo para a animação, 
 * a classe deve ir alterando a célula da spritesheet usada em função do tempo para criar uma animação em ciclo 
 * (sugestão: usar uma função update()).
 */
class MySpriteAnimation{
    constructor(spritesheet, initial, final, period){
        this.spritesheet = spritesheet;
        this.initial = initial;
        this.final = final;
        this.period = period;
    }
}
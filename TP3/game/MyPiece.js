/**
 * MyPiece
 * @constructor
 */

class MyPiece extends CGFobject{
    constructor(scene, type, material, texture, model) {
        super(scene);
        this.scene = scene;
        this.type = type;
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.material = material
        this.texture = texture
        this.tile = null
        this.obj = model.obj
        this.height = model.height

        this.animationComplete = true
    };

    getType(){
        return this.type
    }

    setType(type){
        this.type = type
    }

    getTile(){
        return this.tile
    }

    /**
     * Initializes an Animation
     * @param {MyGameMove} gameMove
     * @param {KeyframeAnimation} animation
     * @param {int} time
     * @param {String} type
     */
    startAnimation(gameMove, animation, time, type) {
        this.gameMove = gameMove
        this.type = type
        this.animation = animation
        this.animation.setStartingTime(time)
        this.animationComplete = false
    }

    stopAnimation() {
        this.animation = null
        this.animationComplete = true
    }

    setTile(tile){
        this.tile = tile
    }

    update(t) {
        if (this.animation != null) {
            if (this.animation.completed) {
                this.gameMove.notifyMoveAnimationCompleted(this.type)
            }

            if (!this.animationComplete) {
                this.animation.update(t)
            }
        }
    }

    display() {
        this.scene.pushMatrix()

        this.material.apply()
        if (this.texture)
            this.texture.bind()

        if (!this.animationComplete) {
            this.animation.apply(this.scene)
        }

        // as the models are being made on a 5x5 XY Plane, we need to rescale them
        this.scene.scale(0.2, 0.2, 0.2)
        this.scene.translate(0, this.height/2, 0)

        this.obj.display()
        this.scene.popMatrix()
    }

    toString() {
        return (this.type === 1) ? "Red Piece" : "Blue Piece"
    }
}
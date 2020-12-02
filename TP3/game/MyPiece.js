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
     * Initializes an animation
     * @param {MyGameMove} gameMove
     * @param {Number} time
     */
    startAnimation(gameMove, time) {
        // TODO : Animation height and speed to change accordingly to distance
        this.animation = new KeyframeAnimation([
            {
                instant: 0,
                translation: vec3.fromValues(0, 0, 0),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.3,
                translation: vec3.fromValues((gameMove.destTile.x - gameMove.origTile.x) / 5, 0.66, (-gameMove.destTile.y + gameMove.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.6,
                translation: vec3.fromValues(2 * (gameMove.destTile.x - gameMove.origTile.x) / 5, 1, 2 * (-gameMove.destTile.y + gameMove.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.9,
                translation: vec3.fromValues(3 * (gameMove.destTile.x - gameMove.origTile.x) / 5, 1, 3 * (-gameMove.destTile.y + gameMove.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 1.2,
                translation: vec3.fromValues(4 * (gameMove.destTile.x - gameMove.origTile.x) / 5, 0.66, 4 * (-gameMove.destTile.y + gameMove.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 1.5,
                translation: vec3.fromValues(gameMove.destTile.x - gameMove.origTile.x, 0,-gameMove.destTile.y + gameMove.origTile.y),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
        ])
        this.gameMove = gameMove
        this.animation.setStartingTime(time)
        this.animationComplete = false
    }

    setTile(tile){
        this.tile = tile
    }

    update(t) {
        if (this.animation != null) {
            if (this.animation.completed) {
                this.animationComplete = true;
                this.animation = null
                this.gameMove.notifyMoveAnimationCompleted()
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
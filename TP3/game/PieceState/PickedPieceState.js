class PickedPieceState extends PieceState {
    constructor(piece) {
        super(piece)
    }

    display() {
        this.piece.scene.pushMatrix()

        this.piece.material.apply()
        if (this.piece.texture)
            this.piece.texture.bind()

        // as the models are being made on a 5x5 XY Plane, we need to rescale them
        this.piece.scene.scale(0.2, 0.2, 0.2)
        this.piece.scene.translate(0, this.piece.height/2 + 0.5, 0)

        this.piece.obj.display()

        this.piece.scene.popMatrix()
    }

    pickPiece() {
        // do nothing as a picked piece cannot be re-picked
    }

    reset() {
        this.piece.changeState(new StaticPieceState(this.piece))
    }

    update(t) {
        // no need to update, only if we have shaders
    }

    startAnimation(gameMove, animation, time, type) {
        this.piece.gameMove = gameMove
        this.piece.type = type
        this.piece.animation = animation
        this.piece.animation.setStartingTime(time)
        this.piece.animationComplete = false
        this.piece.changeState(new AnimatedPieceState(this.piece))
    }

    stopAnimation() {
        // theres no animation to stop as we have not yet begun the animation
    }
}
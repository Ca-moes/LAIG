class AnimatedPieceState extends PieceState {
    constructor(piece) {
        super(piece);
    }

    display() {
        this.piece.scene.pushMatrix()

        this.piece.player === 1 ?
            this.piece.scene.orchestrator.player1material.apply() :
            this.piece.scene.orchestrator.player2material.apply()

        if (this.piece.texture)
            this.piece.texture.bind()

        if (!this.piece.animationComplete) {
            let [x, y, z] = this.piece.animation.getCoords()
            this.piece.scene.translate(x, y, z)
        }

        // as the models are being made on a 5x5 XY Plane, we need to rescale them
        this.piece.scene.scale(0.2, 0.2, 0.2)
        this.piece.scene.translate(0, this.piece.height / 2, 0)

        this.piece.player === 1 ?
            this.piece.scene.orchestrator.models[this.piece.scene.orchestrator.selectedModelPlayer1].display() :
            this.piece.scene.orchestrator.models[this.piece.scene.orchestrator.selectedModelPlayer2].display()

        this.piece.scene.popMatrix()
    }

    pickPiece() {
        // a moving piece doesnt allow the user to pick another piece
    }

    reset() {
        this.piece.changeState(new StaticPieceState(this.piece))
    }

    startAnimation(gameMove, animation, time, type) {
        // we cannot start a new animation as an animation is taking place right now
    }

    stopAnimation() {
        this.piece.animation = null
        this.piece.animationComplete = true
        this.piece.changeState(new StaticPieceState(this.piece))
    }

    update(t) {
        if (!this.piece.animationComplete) {
            this.piece.animation.animate(t)
        }
    }
}
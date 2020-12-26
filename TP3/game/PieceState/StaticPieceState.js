class StaticPieceState extends PieceState {
    constructor(piece) {
        super(piece);
    }

    display() {
        this.piece.scene.pushMatrix()

        this.piece.material.apply()
        if (this.piece.texture)
            this.piece.texture.bind()

        // as the models are being made on a 5x5 XY Plane, we need to rescale them
        this.piece.scene.scale(0.2, 0.2, 0.2)
        this.piece.scene.translate(0, this.piece.height/2, 0)

        this.piece.scene.orchestrator.models[this.piece.scene.orchestrator.selectedModel].display()
        this.piece.scene.popMatrix()
    }

    pickPiece() {
        this.piece.changeState(new PickedPieceState(this.piece))
    }

    update(t) {
        // we dont need to update a static element
    }

    reset() {
        // we dont need to reset, as the current state is the default one
    }

    startAnimation(gameMove, animation, time, type) {
        // static piece cannot initialize movement just yet
    }

    stopAnimation() {
        // static piece cannot stop a movement if it does not exist just yet
    }
}
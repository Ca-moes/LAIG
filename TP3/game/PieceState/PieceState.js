/**
 * @abstract
 * Abstract Piece State
 */
class PieceState {
    constructor(piece) {
        this.piece = piece
    }

    /**
     * @abstract
     */
    pickPiece() {
        throw new Error("Abstract method pickPiece")
    }

    /**
     * @abstract
     */
    reset() {
        throw new Error("Abstract method pickPiece")
    }

    /**
     * @abstract
     */
    update(t) {
        throw new Error("Abstract method update")
    }

    /**
     * @abstract
     */
    display() {
        throw new Error("Abstract method display")
    }

    /**
     * @abstract
     */
    startAnimation(gameMove, animation, time, type) {
        throw new Error("Abstract method startAnimation")
    }

    /**
     * @abstract
     */
    stopAnimation() {
        throw new Error("Abstract method stopAnimation")
    }
}
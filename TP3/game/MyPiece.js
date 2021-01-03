/**
 * MyPiece
 * @constructor
 */
class MyPiece extends CGFobject {
    /**
     * Starts the Piece object
     * @param {XMLscene} scene
     * @param player
     */
    constructor(scene, player) {
        super(scene);
        this.scene = scene;
        this.player = player;
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.tile = null
        this.height = 1
        this.animationComplete = true

        this.state = new StaticPieceState(this)
    };

    /**
     * GET method
     * @returns {MyTile|null}
     */
    getTile() {
        return this.tile
    }

    /**
     * Changes the piece state
     * @param {PieceState} state
     */
    changeState(state) {
        this.state = state
    }

    /**
     * Process a picking event
     */
    pickPiece() {
        this.state.pickPiece()
    }

    /**
     * Resets the piece to Static State
     */
    reset() {
        this.state.reset()
    }

    /**
     * Initializes an Animation
     * @param {MyGameMove} gameMove
     * @param {KeyframeAnimation} animation
     * @param {int} time
     * @param {String} type
     */
    startAnimation(gameMove, animation, time, type) {
        this.state.startAnimation(gameMove, animation, time, type)
    }

    /**
     * Initializes a custom "easing" animation
     * @param {Animations} animation
     * @param time start time in seconds
     */
    startCustomAnimation(animation, time) {
        this.state.startCustomAnimation(animation, time)
    }

    /**
     * Stops the animation, depending on the state
     */
    stopAnimation() {
        this.state.stopAnimation()
    }

    /**
     * Assign a tile to this piece
     * @param {MyTile} tile
     */
    setTile(tile) {
        this.tile = tile
    }

    /**
     * Updates the piece, depending on the state
     * @param t time in seconds
     */
    update(t) {
        this.state.update(t)
    }

    /**
     * Displays the piece, depending on the state
     */
    display() {
        this.state.display()
    }

    /**
     * Helper method
     * @returns {string}
     */
    toString() {
        return (this.player === 1) ? "Red Piece" : "Blue Piece"
    }
}
/**
 * MyPiece
 * @constructor
 */

class MyPiece extends CGFobject{
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

    getPlayer(){
        return this.player
    }

    setPlayer(player){
        this.player = player
    }

    getTile(){
        return this.tile
    }

    /**
     * Changes the piece state
     * @param {PieceState} state
     */
    changeState(state) {
        this.state = state
    }

    pickPiece() {
        this.state.pickPiece()
    }

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

    stopAnimation() {
        this.state.stopAnimation()
    }

    setTile(tile){
        this.tile = tile
    }

    update(t) {
        this.state.update(t)
    }

    display() {
        this.state.display()
    }

    toString() {
        return (this.player === 1) ? "Red Piece" : "Blue Piece"
    }
}
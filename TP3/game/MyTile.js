/**
 * Colors to highlight the tiles with
 * @type {Readonly<{RED: number[], BLUE: number[], GREEN: number[]}>}
 */
const HighlightColors = Object.freeze({
    RED: [0.8, 0.1, 0.1],
    BLUE: [0.275, 0.412, 1.0],
    GREEN: [0.1, 0.8, 0.1]
})

/**
 * Board Tile
 */
class MyTile extends CGFobject {
    /**
     * Starts the tile
     * @param {XMLscene} scene
     * @param {MyGameOrchestrator} gameboard
     * @param x
     * @param y
     * @param {CGFtexture} texture
     */
    constructor(scene, gameboard, x, y, texture) {
        super(scene);
        this.scene = scene;
        this.gameboard = gameboard;
        this.piece = null
        this.x = x;
        this.y = y;
        this.texture = texture
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.state = new StaticTileState(this)

        this.highlightColor = HighlightColors.RED

        this.obj = new Plane(scene, 5, 5)
    };

    /**
     * Helper method
     * @returns {string}
     */
    toString() {
        return `Tile X:${this.x} | Y:${String.fromCharCode(65 + this.y)} with Piece: ${this.piece}`
    }

    /**
     * GET method
     * @returns {MyPiece|null}
     */
    getPiece() {
        return this.piece
    }

    /**
     * SET method
     * @param {MyPiece} piece
     */
    setPiece(piece) {
        this.piece = piece
    }

    /**
     * Unsets the tile's piece
     */
    unsetPiece() {
        this.piece = null
    }

    /**
     * Changes the tile's state
     * @param {TileState} state
     */
    changeState(state) {
        this.state = state
    }

    /**
     * Highlights the Tile with a color
     * @param {HighlightColors} color
     */
    highlightTile(color) {
        this.state.highlightTile(color)
    }

    /**
     * Disables the highlighting effect
     */
    disableHighlighting() {
        this.state.disableHighlight()
    }

    /**
     * Displays the tile, this depend on the state
     */
    display() {
        this.state.display()
    }

    /**
     * If there's a piece set, processes the picking event
     */
    pickPiece() {
        if (this.piece) this.piece.pickPiece()
    }

    /**
     * Updates the tile, depending on the state
     * @param t time in seconds
     */
    update(t) {
        this.state.update(t)
    }
}
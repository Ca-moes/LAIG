/**
 * MyTile
 * @constructor
 */

const HighlightColors = Object.freeze({
    RED: [0.8, 0.1, 0.1],
    BLUE: [0.275, 0.412, 1.0],
    GREEN: [0.1, 0.8, 0.1]
})

class MyTile extends CGFobject {
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

    toString() {
        return `Tile X:${this.x} | Y:${String.fromCharCode(65 + this.y)} with Piece: ${this.piece}`
    }

    getPiece() {
        return this.piece
    }

    setPiece(piece) {
        this.piece = piece
    }

    unsetPiece() {
        this.piece = null
    }

    changeState(state) {
        this.state = state
    }

    highlightTile(color) {
        this.state.highlightTile(color)
    }

    disableHighlighting() {
        this.state.disableHighlight()
    }

    display() {
        this.state.display()
    }

    pickPiece() {
        if (this.piece) this.piece.pickPiece()
    }


    update(t) {
        this.state.update(t)
    }
}
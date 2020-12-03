/**
 * MyTile
 * @constructor
 */

class MyTile extends CGFobject {
    constructor(scene, gameboard, x, y, material, texture) {
        super(scene);
        this.scene = scene;
        this.gameboard = gameboard;
        this.piece = null
        this.x = x;
        this.y = y;
        this.material = material
        this.texture = texture
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.state = new StaticTIleState(this)

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

    highlightTile() {
        this.state.highlightTile()
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
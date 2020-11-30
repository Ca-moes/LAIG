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

    display() {
        this.scene.pushMatrix()

        this.material.apply()
        if (this.texture)
            this.texture.bind()

        this.obj.display()
        this.scene.popMatrix()

        if (this.piece) {
            this.piece.display()
        }
    }
}
/**
 * MyTile
 * @constructor
 */

class MyTile extends CGFobject{
    constructor(scene, gameboard, piece, x, y) {
        super(scene);
        this.scene = scene;
        this.gameboard = gameboard;
        this.piece = piece
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.obj = new Plane(scene, 5, 5)
    };

    getPiece(){
        return this.piece
    }

    setPiece(piece){
        this.piece = piece
    }

    display() {
        this.scene.pushMatrix()
        this.scene.scale(1.69, 1.69, 0)
        this.scene.rotate(Math.PI/2, 1, 0, 0 )
        this.obj.display()
        this.scene.popMatrix()
        this.piece.display()
    }
}
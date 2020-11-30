/**
 * MyTile
 * @constructor
 */

class MyTile extends CGFobject{
    constructor(scene, gameboard, x, y) {
        super(scene);
        this.scene = scene;
        this.gameboard = gameboard;
        this.piece = null
        this.x = x;
        this.y = y;
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.obj = new Plane(scene, 5, 5)

        this.material = new CGFappearance(this.scene)

        this.material.setShininess(10)
        this.material.setEmission(0, 0, 0, 0)
        this.material.setAmbient(0.3, 0.3, 0.3, 1)
        this.material.setDiffuse(0.5, 0.5, 0.5, 1)
        this.material.setSpecular(0.1, 0.1, 0.1, 1)

        this.texture = new CGFtexture(this.scene, './scenes/images/tile.jpg')
    };

    toString() {
        return `Tile X:${this.x} | Y:${String.fromCharCode(65 + this.y)} with Piece:${this.piece}`
    }

    getPiece(){
        return this.piece
    }

    setPiece(piece){
        this.piece = piece
    }

    unsetPiece(){
        this.piece = null
    }

    display() {
        this.material.apply()
        this.texture.bind()

        this.scene.pushMatrix()
        this.scene.scale(1, 1, 1)
        this.scene.rotate(Math.PI/2, 1, 0, 0 )
        this.obj.display()
        this.scene.popMatrix()
        
        if (this.piece) {
            this.piece.display()
        }
    }
}
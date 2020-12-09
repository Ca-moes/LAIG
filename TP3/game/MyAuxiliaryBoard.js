class MyAuxiliaryBoard extends CGFobject {
    constructor(scene, gameboard) {
        super(scene);
        this.scene = scene
        this.gameboard = gameboard

        this.box = new MyBox(scene)

        this.pieces = []
    }

    undo() {
        this.pieces.pop()
    }

    addPiece(piece) {
        console.log("added piece: " + piece)
        this.pieces.push(piece)
        console.log("number of pieces: " + this.pieces.length)
    }

    getNextPieceCoords() {
        let x = 0, y = 0, z = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            x += 0.8
            if (x === 1.6) {
                x = 0
                z += 0.8
            }
            if (z === 0.8*3) {
                z = 0
                y += 0.2
            }
        }
        return {x: x, y:y, z:z}
    }

    display() {
        this.scene.pushMatrix()

        let x = 0, y = 0, z = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            this.scene.pushMatrix()
            this.scene.translate(x - 0.4, y - 0.35, z - 0.8)
            this.pieces[i].display()
            this.scene.popMatrix()

            x += 0.8
            if (x === 1.6) {
                x = 0
                z += 0.8
            }
            if (z === 0.8*3) {
                z = 0
                y += 0.2
            }
        }

        this.scene.scale(1, 1, 0.75)
        this.box.display()
        this.scene.popMatrix()
    }
}
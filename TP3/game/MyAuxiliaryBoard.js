class MyAuxiliaryBoard extends CGFobject {
    constructor(scene, gameboard) {
        super(scene);
        this.scene = scene
        this.gameboard = gameboard

        this.box = gameboard.orchestrator.boxModel

        this.pieces = []
    }

    emptyBoard() {
        this.pieces = []
    }

    undo() {
        this.pieces.pop()
    }

    addPiece(piece) {
        this.pieces.push(piece)
    }

    getNextPieceCoords() {
        let x = 0, y = 0, z = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            x += 1
            if (x === 2) {
                x = 0
                z += 1
            }
            if (z === 4) {
                z = 0
                y += 1
            }
        }
        return {x: x, y: y, z: z}
    }

    display() {
        this.scene.pushMatrix()
        let x = 0, y = 0, z = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            this.scene.pushMatrix()
            this.scene.translate(x - 0.5, y * 0.2 - 0.35, z - 1.5)
            this.pieces[i].display()
            this.scene.popMatrix()
            x += 1
            if (x === 2) {
                x = 0
                z += 1
            }
            if (z === 4) {
                z = 0
                y += 1
            }
        }
        this.gameboard.orchestrator.boxMaterial.apply()
        this.scene.scale(1.15, 1, 1.15)
        this.box.display()
        this.scene.popMatrix()
    }
}
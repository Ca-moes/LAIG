class MyAuxiliaryBoard extends CGFobject {
    constructor(scene, gameboard) {
        super(scene);
        this.scene = scene
        this.gameboard = gameboard

        this.box = new MyBox(scene)

        this.pieces = []

        this.test()
    }

    addPiece(piece) {
        this.pieces.push(piece)
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

    test() {
        for (let i = 0; i < 21; i++) {
            this.pieces.push(new MyPiece(
                this.scene,
                1,
                this.gameboard.properties.player1.material,
                this.gameboard.properties.player1.texture,
                this.gameboard.properties.model))
        }
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
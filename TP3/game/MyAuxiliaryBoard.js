/**
 * Class to be responsible for holding the pieces after they are
 * removed from the board
 */
class MyAuxiliaryBoard extends CGFobject {
    /**
     * Starts the auxiliary board
     * @param {XMLscene} scene
     * @param {MyGameBoard} gameboard
     */
    constructor(scene, gameboard) {
        super(scene);
        this.scene = scene
        this.gameboard = gameboard

        this.box = gameboard.orchestrator.boxModel

        this.pieces = []
    }

    /**
     * empties the board, right?
     */
    emptyBoard() {
        this.pieces = []
    }

    /**
     * This algorithm finds where is position the last inserted piece
     * @returns {{x: number, y: number, z: number}}
     */
    currentCoords() {
        let x = 0, y = 0, z = 0;
        if (this.pieces.length <= 0) return {x: x, y: y, z: z}
        for (let i = 0; i < this.pieces.length - 1; i++) {
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

    /**
     * This method removes the last inserted piece
     */
    undo() {
        this.pieces.pop()
    }

    /**
     * This method inserts a piece on the stack
     * @param {MyPiece} piece piece to insert
     */
    addPiece(piece) {
        this.pieces.push(piece)
    }

    /**
     * This method is similar to the currentCoords, but it this one finds where
     * the next (not inserted yet) piece should be positioned on the stack.
     * @returns {{x: number, y: number, z: number}}
     */
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

    /**
     * This method displays the auxiliary board, it displays the pieces according to
     * a position calculated here, and the it applies the box material and displays the
     * box model.
     */
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

    /**
     * This method updates every piece on the auxiliary board
     * @param t time in seconds
     */
    update(t) {
        this.pieces.forEach(piece => piece.update(t))
    }
}
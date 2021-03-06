/**
 * Game's GameBoard
 */
class MyGameBoard extends CGFobject {
    /**
     * Starts the game board
     * @param {XMLscene} scene
     * @param {MyGameOrchestrator} orchestrator
     * @param size
     * @param {Object} properties
     */
    constructor(scene, orchestrator, size, properties) {
        super(scene)
        this.scene = scene
        this.size = size
        this.orchestrator = orchestrator

        this.updateBoard(properties)

        this.board = []
        this.updatedTexCoords = true;

        this.boardsides = new MyBoardFrame(this.scene, size)
        this.auxiliaryBoard = new MyAuxiliaryBoard(scene, this)
        this.animator = new MyBoardAnimator(this)

        this.createBoard()
    }

    /**
     * This method updates the board's properties, this is called on start and when the user
     * changes the scene. Some scenes have different board properties, such as transformations,
     * positions, camera settings, etc.
     * @param {Object} properties
     */
    updateBoard(properties) {
        this.properties = properties
        this.transformations = properties.transformations
        this.texture = properties.texture
    }

    /**
     * This method starts an appearing animation (described on MyBoardAnimator) with a callback method to be
     * called when the animation is done
     * @param {Function} callback method to be called when the animation is finished
     */
    startAppearingAnimation(callback) {
        this.animator.startAppearingAnimation(callback)
    }

    /**
     * This method starts a restart animation (described on MyBoardAnimator) with a callback method to be
     * called when the animation is done
     * @param {Function} callback method to be called when the animation is finished
     */
    startRestartAnimation(callback) {
        this.animator.startRestartAnimation(callback)
    }

    /**
     * This method creates a chess-like board
     */
    createBoard() {
        let pieceType = 1
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let tile = new MyTile(
                    this.scene,
                    this, x, y,
                    this.texture)
                let piece = new MyPiece(
                    this.scene,
                    pieceType)

                piece.originalX = x
                piece.originalY = y

                tile.setPiece(piece)
                piece.setTile(tile)
                this.board.push(tile)
                pieceType = -pieceType
            }
            if (this.size % 2 === 0)
                pieceType = -pieceType
        }
    }

    /**
     * This method is useful to code the board to a string so we can send it to prolog
     * server
     * @returns {String} board coded "[[1,1,-1,0],[1,0,0,1],...]"
     */
    toString() {
        let board = [];
        let index = 0;
        for (let y = 0; y < this.size; y++) {
            let row = []
            for (let x = 0; x < this.size; x++) {
                if (this.board[index].piece) {
                    row.push(this.board[index].piece.player)
                } else {
                    row.push(0)
                }
                index++;
            }
            board.push(row)
        }
        return JSON.stringify(board)
    }

    /**
     * This method "fills" the path for a solution. The tiles which are marked with true on the solution
     * array are highlighted as green.
     * @param {Array[]} solution
     */
    fillPath(solution) {
        for (let y = 0; y < solution.length; y++) {
            for (let x = 0; x < solution.length; x++) {
                if (solution[y][x])
                    this.board[y * this.size + x].highlightTile(HighlightColors.GREEN)
            }
        }
    }

    /**
     * This method updates the board's pieces and aux' too.
     * @param t time in seconds
     */
    update(t) {
        for (let i = 0; i < this.board.length; i++) {
            this.board[i].update(t)
        }
        this.auxiliaryBoard.update(t)
    }

    /**
     *
     * @param x
     * @param y
     * @returns {MyTile} tile
     */
    getTile(x, y) {
        return this.board[y * this.size + x]
    }

    /**
     * This method highlights tiles as enemy tiles.
     * @param {Array[]} tiles tiles to highlighted - [[x, y], [x1, y1], [x2, y2], ...]
     */
    highlightEnemyTiles(tiles) {
        for (let i = 0; i < tiles.length; i++) {
            let tile = this.getTile(tiles[i][0], tiles[i][1])
            tile.friend = false
            tile.highlightTile(HighlightColors.RED)
        }
    }

    /**
     * This method disables every highlighted tile on the board.
     */
    disableHighlight() {
        for (let i = 0; i < this.board.length; i++) {
            this.board[i].disableHighlighting()
        }
    }

    /**
     * Method to log the picking results, and trigger a pickTile event on the case of
     * valid picking.
     */
    logPicking() {
        if (this.scene.pickMode === false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (let i = 0; i < this.scene.pickResults.length; i++) {
                    const obj = this.scene.pickResults[i][0];
                    if (obj instanceof MyTile) {
                        this.orchestrator.pickTile(obj)
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    /**
     * Method to display the board and its pieces
     */
    display() {
        this.logPicking()
        this.scene.clearPickRegistration();

        this.scene.multMatrix(this.transformations)

        this.scene.pushMatrix()
        this.scene.translate(this.size * 0.8, 0.5, 0)
        this.auxiliaryBoard.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.boardsides.display()
        this.scene.popMatrix()

        let index = 0
        for (let z = 0; z < this.size; z++) {
            for (let x = 0; x < this.size; x++) {
                this.scene.registerForPick(index + 1, this.board[index]);

                this.scene.pushMatrix()
                this.scene.translate(x - (this.size / 2) + 0.5, 0, z - (this.size / 2) + 0.5)
                this.board[index].display()
                this.scene.popMatrix()
                index++
            }
        }
    }

    /**
     * Low-Level Method to move a piece from one tile to another
     * as the original tile should have a piece, we dont need to pass
     * it as an argument, instead, we throw an exception in case the original
     * tile does not contain a piece
     *
     * The exception is just here to remind us that we cannot initiate a move
     * when no piece is available on the tile, but this will be handled by prolog
     * backend
     *
     * @param originalTile      {MyTile} Original Tile
     * @param destinationTile   {MyTile} Destination Tile
     */
    movePiece(originalTile, destinationTile) {
        const piece = originalTile.getPiece()
        if (piece == null) throw new Error("movePiece(): Tile does not contain a piece to move!")

        const removed = destinationTile.getPiece()
        destinationTile.setPiece(piece)
        originalTile.unsetPiece()

        this.auxiliaryBoard.addPiece(removed)

        this.orchestrator.custom.logPieceMoved(originalTile, destinationTile)
    }

    /**
     * Deep Clone of the game board, this clone copies every tile and piece of the current game board
     * @returns {MyGameBoard} cloned board
     */
    clone() {
        let board = new MyGameBoard(this.scene, this.orchestrator, this.size, this.properties)
        board.board = []
        board.auxiliaryBoard = this.auxiliaryBoard
        let clonedBoard = []
        this.board.forEach((value => {
            let tile = new MyTile(
                this.scene,
                board, value.x, value.y,
                this.texture)
            if (value.piece) {
                let piece = new MyPiece(
                    this.scene,
                    value.piece.player)
                tile.setPiece(piece)

                piece.originalX = value.piece.originalX
                piece.originalY = value.piece.originalY
            }
            clonedBoard.push(tile)
        }))
        board.board = clonedBoard

        return board
    }
}
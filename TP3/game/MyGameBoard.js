class MyGameBoard extends CGFobject{
    constructor(scene, centerx, centery, size){
        super(scene)
        this.scene = scene
        this.centerx = centerx
        this.centery = centery
        this.size = size
        this.board = []
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.createBoard()
    }

    createBoard(){
        let pieceType = 1
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let tile = new MyTile(this.scene, this, x, y)
                let piece = new MyPiece(this.scene, pieceType)
                tile.setPiece(piece)
                piece.setTile(tile)
                this.board.push(tile)
                pieceType = -pieceType
            }
            if (this.size%2 == 0)
                pieceType = -pieceType
        }
    }

    logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj instanceof MyTile) {
						var customId = this.scene.pickResults[i][1];
						console.log("Picked object: " + obj.toString() + ", with pick id " + customId);
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
	}

    display(){
        this.logPicking()
        this.scene.clearPickRegistration();

        let index = 0
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {

                this.scene.registerForPick(index + 1, this.board[index]);

                this.scene.pushMatrix()
                this.scene.rotate(-Math.PI/2, 1, 0, 0)
                this.scene.translate(this.centerx,this.centery, 0)
                this.scene.translate(x - (this.size/2) + 0.5, -y + (this.size/2) - 0.5, 0)
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
     * @return {MyPiece} moved
     */
    movePiece(originalTile, destinationTile) {
        const piece = originalTile.getPiece()
        if (piece == null) throw "movePiece(): Tile does not contain a piece to move!"

        destinationTile.setPiece(piece)
        originalTile.unsetPiece()

        console.log("Piece Moved")

        return piece
    }

    clone() {
        let board = new MyGameBoard(this.scene, this.centerx, this.centery, this.size)
        board.board.clear()
        let clonedBoard = []
        this.board.forEach((value => {
            /*let piece = null
            if (value.getPiece())
                piece = new MyPiece(this.scene, value.getPiece().getType())
            let tile = new MyTile(this.scene, board, value, value.x, value.y)
            tile.setPiece(piece)
            clonedBoard.push(tile)*/
            clonedBoard.push(value)
        }))
        board.board = clonedBoard
        return board
    }
}
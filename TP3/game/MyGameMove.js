class MyGameMove {
    /**
     * Constructor of MyGameMove
     * @param piece         {MyPiece}       a pointer to a piece
     * @param origTile      {MyTile}        a pointer to the original tile
     * @param destTile      {MyTile}        a pointer to the destination tile
     * @param gameboard     {MyGameBoard}   a pointer to the GameBoard
     */
    constructor(piece, origTile, destTile, gameboard) {
        this.piece = piece
        this.origTile = origTile
        this.destTile = destTile
        this.gameboard = gameboard.clone()
    }

    /**
     * Method to animate a game movement
     */
    animate() {
        // TODO
    }
}
class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        this.tile = tile
        this.orchestrator.prolog.canPickTile(tile)
    }

    pickValidTile(tile) {
        // this.orchestrator.prolog.getRequest(`available_moves(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${tile.x}-${tile.y})`)

        tile.pickPiece()
        tile.highlightTile()

        this.orchestrator.startPicking(tile)
        this.orchestrator.changeState(new MoveState(this.orchestrator))
    }

    animationEnd() {
        // do nothing, as no animation should be happening here
    }


    pickInvalidTile(tile) {
        // do nothing if user picks an empty tile
    }


    /**
     * This method is called when request reply is obtained
     * -> 1 to cant pick
     * -> 0 to can pick
     * @param {int} msg
     */
    notifyReplyReceived(msg) {
        if (msg == 0) this.pickValidTile(this.tile)
    }
}
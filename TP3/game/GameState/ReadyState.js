class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        this.orchestrator.prolog.getRequest(`spot(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${tile.x}-${tile.y})`)
        this.tile = tile
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


    notifyReplyReceived(msg) {
        if (msg == 0) this.pickValidTile(this.tile)
    }
}
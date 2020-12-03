class MoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    pickValidTile(tile) {
        tile.pickPiece()
        this.orchestrator.performMove(tile)
        this.orchestrator.changeState(new AnimationState(this.orchestrator))
    }

    animationEnd() {
        // do nothing here
    }

    pickInvalidTile(tile) {
        this.orchestrator.cancelMove()
        this.orchestrator.changeState(new ReadyState(this.orchestrator))
    }


    notifyReplyReceived(msg) {
        if (msg == 0) this.pickValidTile(this.tile)
        else this.pickInvalidTile(this.tile)
    }

    pickTile(tile) {
        this.orchestrator.prolog.getRequest(`moveto(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${this.orchestrator.currentMovement.origTile.x}-${this.orchestrator.currentMovement.origTile.y}-${tile.x}-${tile.y})`)
        this.tile = tile
    }
}

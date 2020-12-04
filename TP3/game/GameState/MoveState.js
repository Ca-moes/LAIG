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

    /**
     * This method is called when request reply is obtained
     * -> 1 to cant move
     * -> 0 to can move
     * @param {int} msg
     */
    notifyReplyReceived(msg) {
        if (msg == 0) this.pickValidTile(this.tile)
        else this.pickInvalidTile(this.tile)
    }


    pickTile(tile) {
        this.tile = tile
        this.orchestrator.prolog.canMoveToTile(tile)
    }
}

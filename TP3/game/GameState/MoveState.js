class MoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    animationEnd() {
        // do nothing here
    }

    pickTile(tile) {
        this.tile = tile
        this.orchestrator.prolog.canMoveToTile(tile)
    }

    /**
     * This method is called when request reply is obtained
     * -> 1 to cant move
     * -> 0 to can move
     * @param {int} msg
     */
    notifyReplyReceived(msg) {
        if (msg === 0) {
            this.tile.pickPiece()
            this.orchestrator.performMove(this.tile)
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.changeState(new AnimationState(this.orchestrator))
        }
        else if (msg === 1) {
            this.orchestrator.cancelMove()
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.changeState(new ReadyState(this.orchestrator))
        }
    }
}

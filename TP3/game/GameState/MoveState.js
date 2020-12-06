class MoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    animationEnd() {
        // do nothing here
    }

    pickTile(tile) {
        const reply = this.orchestrator.prolog.canMoveToTile(tile)
        if (reply === 0) {
            tile.pickPiece()
            this.orchestrator.performMove(tile)
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.changeState(new AnimationState(this.orchestrator))
        }
        else if (reply === 1) {
            this.orchestrator.cancelMove()
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.changeState(new ReadyState(this.orchestrator))
        }
    }
}

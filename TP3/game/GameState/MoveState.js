class MoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    pickValidTile(tile) {
        tile.getPiece().pickPiece()
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
}

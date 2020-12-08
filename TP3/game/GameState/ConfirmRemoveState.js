class ConfirmRemoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    animationEnd() {
        // no animation taking place
    }

    pickTile(tile) {
        if (tile === this.orchestrator.currentMovement.origTile) {
            this.orchestrator.performMove(tile)
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.changeState(new AnimationState(this.orchestrator))
        }
        else {
            this.orchestrator.cancelMove()
            this.orchestrator.changeState(new RemoveState(this.orchestrator))
        }
    }
}
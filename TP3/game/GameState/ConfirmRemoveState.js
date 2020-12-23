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

    update(time) {
        this.orchestrator.theme.updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.animator.update(time)
    }

    undo() {
        let move = this.orchestrator.gameSequence.undo()
        if (move != null) {
            this.orchestrator.gameboard.auxiliaryBoard.undo()

            this.orchestrator.gameboard = move.gameboard
            this.orchestrator.gameboard.orchestrator = this.orchestrator

            this.orchestrator.nextTurn()
            console.log("Undo Movement")
        }
    }
}
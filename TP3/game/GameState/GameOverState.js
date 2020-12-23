class GameOverState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
        this.orchestrator.scene.interface.addReplayButton()
    }

    animationEnd() {
        // theres no animation on game over state
    }

    pickTile(tile) {
        // again, wont be picking anything just yet
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
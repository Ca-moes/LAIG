class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        // do nothing as an animation is taking place
    }

    animationEnd() {
        this.orchestrator.prolog.checkWinner(this, (reply) => {
            if (reply === 1) {
                console.log("Winner: Player 1")
                this.orchestrator.changeState(new GameOverState(this.orchestrator))
            }
            else if (reply === -1) {
                console.log("Winner: Player 2")
                this.orchestrator.changeState(new GameOverState(this.orchestrator))
            }
            else if (reply === 0) {
                this.orchestrator.nextTurn()
                console.log("No Winner Yet")
                this.orchestrator.changeState(new CameraAnimationState(this.orchestrator))
            }
        })
    }

    update(time) {
        this.orchestrator.theme.updateAnimations(time);
        this.orchestrator.gameboard.update(time)

        if (this.orchestrator.currentMovement.animationCompleted) {
            this.orchestrator.currentMovement = null
            this.orchestrator.animationEnd()
        }

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
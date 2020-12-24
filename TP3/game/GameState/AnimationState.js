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
                this.orchestrator.incrementPlayer1Score()
                console.log("Winner: Player 1")
                this.orchestrator.hud.updateMessage("Player 1 Wins")
                this.orchestrator.changeState(new GameOverState(this.orchestrator))
            }
            else if (reply === -1) {
                this.orchestrator.incrementPlayer2Score()
                this.orchestrator.hud.updateMessage("Player 2 Wins")
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
            this.orchestrator.currentMovement = null // dont think this is necessary
            this.orchestrator.animationEnd()
        }

        this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))

        this.orchestrator.animator.update(time)
    }

    undo() {
        // cannot undo while animating
    }
}
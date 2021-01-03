class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        this.waitingReply = false
    }

    pickTile(tile) {
        // do nothing as an animation is taking place
    }

    /**
     * When the animation is over we need to check if there's a winner, if there's a winner the state changes to
     * GameOver and some messages are displayed to the HUDs and the console. If no winner is found then it calls
     * the nextTurn method on the orchestrator.
     */
    animationEnd() {
        if (!this.waitingReply) {
            this.waitingReply = true
            this.orchestrator.prolog.checkWinner(this, (reply) => {
                if (reply === 1) {
                    this.orchestrator.updatePlayer1Score(++this.orchestrator.player1score)
                    this.orchestrator.custom.log("Winner: Player 1")
                    this.orchestrator.hud.updateMessage("Player 1 Wins".toUpperCase())
                    this.orchestrator.changeState(new GameOverState(this.orchestrator))
                } else if (reply === -1) {
                    this.orchestrator.updatePlayer2Score(++this.orchestrator.player2score)
                    this.orchestrator.hud.updateMessage("Player 2 Wins".toUpperCase())
                    this.orchestrator.custom.log("Winner: Player 2")
                    this.orchestrator.changeState(new GameOverState(this.orchestrator))
                } else if (reply === 0) {
                    this.orchestrator.custom.extraInfo("No Winner Yet")
                    this.orchestrator.nextTurn()
                }
            })
        }
    }

    /**
     * Updates the elements of the orchestrator
     * @param time time in seconds
     */
    update(time) {
        this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
        this.orchestrator.gameboard.update(time)

        if (this.orchestrator.currentMovement.animationCompleted) {
            this.orchestrator.animationEnd()
        }

        this.orchestrator.camera.animate(time)

        this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))
    }

    undo() {
        // cannot undo while animating
    }

    continue() {
        // cannot continue on animation state
    }

    pause() {
        // cannot pause on animation state
    }
}
class GameOverState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
        this.orchestrator.scene.interface.addReplayButton()
        this.orchestrator.scene.interface.addRestartButton()

        this.orchestrator.prolog.checkWinner(this, (reply) => this.winner = (reply === 1) ? 1 : 2)
    }

    animationEnd() {
        // theres no animation on game over state
    }

    pickTile(tile) {
        // again, wont be picking anything just yet
    }

    update(time) {
        this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.animator.update(time)
    }

    undo() {
        if (this.winner === 1)
            this.orchestrator.updatePlayer1Score(--this.orchestrator.player1score)
        else
            this.orchestrator.updatePlayer2Score(--this.orchestrator.player2score)

        super.undo();
    }
}
class GameOverState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
        this.orchestrator.scene.interface.addReplayButton()
        this.orchestrator.scene.interface.addRestartButton()

        this.orchestrator.prolog.checkWinner(this, (reply) => {
            this.winner = (reply === 1) ? 1 : 2

            let board = JSON.parse(this.orchestrator.gameboard.toString())
            let solution = (this.winner === 1) ? GraphUtils.findPathPlayer1(board) : GraphUtils.findPathPlayer2(board)

            this.orchestrator.gameboard.fillPath(solution)
        })

        this.orchestrator.currentPlayer = this.orchestrator.currentPlayer.code === 1 ? this.orchestrator.player2 : this.orchestrator.player1
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
        this.orchestrator.error.log("Cannot Undo While on Game Over State")
    }
}
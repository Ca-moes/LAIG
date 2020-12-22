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
                this.orchestrator.prolog.checkFinalState(this, (finalState) => {
                    if (finalState === 0) {
                        console.log("No More Moves for Player " + this.orchestrator.currentPlayer.code)
                        this.orchestrator.changeState(new RemoveState(this.orchestrator))
                    }
                    else if (finalState === 1) {
                        console.log("Moves Available for Player " + this.orchestrator.currentPlayer.code)
                        this.orchestrator.changeState(new ReadyState(this.orchestrator))
                    }
                })
            }
        })

    }
}
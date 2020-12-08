class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        // do nothing as an animation is taking place
    }

    animationEnd() {
        let reply = this.orchestrator.prolog.checkWinner()
        if (reply === 1) {
            console.log("Winner: Player 1")
            this.orchestrator.changeState(new GameOverState(this.orchestrator))
        }
        else if (reply === -1) {
            console.log("Winner: Player 2")
            this.orchestrator.changeState(new GameOverState(this.orchestrator))
        }
        else if (reply === 0) {
            console.log("No Winner Yet")
            reply = this.orchestrator.prolog.checkFinalState();
            if (reply === 0) {
                console.log("No More Moves for Player " + this.orchestrator.currentPlayer)
                this.orchestrator.changeState(new RemoveState(this.orchestrator))
            }
            else if (reply === 1) {
                console.log("Moves Available for Player " + this.orchestrator.currentPlayer)
                this.orchestrator.changeState(new ReadyState(this.orchestrator))
            }
        }
    }
}
class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        // do nothing as an animation is taking place
    }

    animationEnd() {
        this.orchestrator.prolog.checkWinner()
    }

    notifyReplyReceived(msg) {
        if (msg == 1) {
            console.log("Winner: Player 1")
            this.orchestrator.changeState(new GameOverState(this.orchestrator))
        }
        else if (msg == -1) {
            console.log("Winner: Player 2")
            this.orchestrator.changeState(new GameOverState(this.orchestrator))
        }
        else if (msg == 0) {
            console.log("No Winner Yet")
            this.orchestrator.changeState(new ReadyState(this.orchestrator))
        }
    }
}
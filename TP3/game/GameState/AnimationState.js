class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickValidTile(tile) {
        // do nothing as an animation is taking place
    }

    animationEnd() {
        this.orchestrator.prolog.checkWinner()
        this.orchestrator.currentPlayer = 3 - this.orchestrator.currentPlayer
    }


    pickInvalidTile(tile) {
        // do nothing as an animation is taking place
    }

    pickTile(tile) {
        // cannot pick tile when animated
    }

    notifyReplyReceived(msg) {
        if (msg == 1) {
            console.log("Winner: Player 1")
        }
        else if (msg == -1) {
            console.log("Winner: Player 2")
        }
        else if (msg == 0) {
            console.log("No Winner Yet")
        }
        // still not changing states properly, so when theres a winner
        // the game will just continue
        this.orchestrator.changeState(new ReadyState(this.orchestrator))
    }
}
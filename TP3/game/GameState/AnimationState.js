class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        // do nothing as an animation is taking place
    }

    animationEnd() {
        const reply = this.orchestrator.prolog.checkWinner()
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
            this.orchestrator.changeState(new ReadyState(this.orchestrator))
        }
    }
}
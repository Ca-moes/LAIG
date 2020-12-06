class GameOverState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    animationEnd() {
        // theres no animation on game over state
    }

    pickTile(tile) {
        // again, wont be picking anything just yet
    }
}
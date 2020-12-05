class GameOverState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }


    animationEnd() {
        // theres no animation on game over state
    }

    notifyReplyReceived(msg) {
        // wont have a reply at this point
    }

    pickInvalidTile(tile) {
        // wont be picking anything just yet
    }

    pickTile(tile) {
        // again, wont be picking anything just yet
    }

    pickValidTile(tile) {
        // again, wont be picking anything just yet
    }
}
class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickValidTile(tile) {
        // do nothing as an animation is taking place
    }

    animationEnd() {
        this.orchestrator.currentPlayer = 3 - this.orchestrator.currentPlayer
        this.orchestrator.changeState(new ReadyState(this.orchestrator))
    }


    pickInvalidTile(tile) {
        // do nothing as an animation is taking place
    }

    notifyReplyReceived(msg) {
        // not sure what to do
    }

    pickTile(tile) {
        // cannot pick tile when animated
    }
}
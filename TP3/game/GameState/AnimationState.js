class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickValidTile(tile) {
        // do nothing as an animation is taking place
    }

    animationEnd() {
        this.orchestrator.changeState(new ReadyState(this.orchestrator))
    }


    pickInvalidTile(tile) {
        // do nothing as an animation is taking place
    }
}
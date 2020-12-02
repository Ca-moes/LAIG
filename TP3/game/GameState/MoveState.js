class MoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    pickTile(tile) {
        this.orchestrator.performMove(tile)
        this.orchestrator.changeState(new AnimationState(this.orchestrator))
    }


    animationEnd() {
        // do nothing here
    }
}

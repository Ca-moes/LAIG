class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        this.orchestrator.startPicking(tile)
        this.orchestrator.changeState(new MoveState(this.orchestrator))
    }

    animationEnd() {
        // do nothing, as no animation should be happening here
    }
}
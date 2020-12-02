class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickValidTile(tile) {
        this.orchestrator.startPicking(tile)
        this.orchestrator.changeState(new MoveState(this.orchestrator))
    }

    animationEnd() {
        // do nothing, as no animation should be happening here
    }


    pickInvalidTile(tile) {
        // do nothing if user picks an empty tile
    }
}
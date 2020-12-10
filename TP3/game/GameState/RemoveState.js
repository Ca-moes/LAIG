class RemoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    animationEnd() {
        // theres no animation taking place
    }

    pickTile(tile) {
        this.orchestrator.prolog.canRemovePiece(tile, this, (reply) => {
            if (reply === 0) {
                tile.pickPiece()
                tile.highlightTile(false)
                this.orchestrator.startPicking(tile)
                this.orchestrator.changeState(new ConfirmRemoveState(this.orchestrator))
            }
        })
    }
}
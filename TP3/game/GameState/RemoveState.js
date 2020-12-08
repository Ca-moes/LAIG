class RemoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }


    animationEnd() {
        // theres no animation taking place
    }

    pickTile(tile) {
        let reply = this.orchestrator.prolog.canRemovePiece(tile)

        if (reply === 0) {
            tile.pickPiece()
            tile.highlightTile(false)
            this.orchestrator.startPicking(tile)

            console.log("changing state to confirm remove")

            this.orchestrator.changeState(new ConfirmRemoveState(this.orchestrator))
        }
        else if (reply === 1) {
            // do nothing
        }
    }
}
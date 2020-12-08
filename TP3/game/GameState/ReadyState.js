class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        let reply = this.orchestrator.prolog.canPickTile(tile)

        if (reply === 0) {
            tile.pickPiece()
            tile.highlightTile()
            this.orchestrator.startPicking(tile)

            // highlight possible movements
            let reply = this.orchestrator.prolog.getPossibleTiles(tile)
            if (reply instanceof Array) this.orchestrator.gameboard.highlightEnemyTiles(reply)

            this.orchestrator.changeState(new MoveState(this.orchestrator))
        }
        else if (reply === 1) {
            // do nothing
        }
    }

    animationEnd() {
        // do nothing, as no animation should be happening here
    }
}
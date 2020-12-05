class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        this.tile = tile
        this.orchestrator.prolog.canPickTile(tile)
    }

    animationEnd() {
        // do nothing, as no animation should be happening here
    }

    /**
     * This method is called when request reply is obtained
     * -> 1 to cant pick
     * -> 0 to can pick
     * @param {int, Array} msg
     */
    notifyReplyReceived(msg) {
        if (msg === 0) {
            this.tile.pickPiece()
            this.tile.highlightTile()

            this.orchestrator.startPicking(this.tile)

            this.orchestrator.prolog.getPossibleTiles(this.tile)

            // this.orchestrator.changeState(new MoveState(this.orchestrator))
        }
        else if (msg === 1) {
            // do nothing
        }
        // highlight possible movements
        if (msg instanceof Array) {
            this.orchestrator.gameboard.highlightEnemyTiles(msg)
            this.orchestrator.changeState(new MoveState(this.orchestrator))
        }
    }
}
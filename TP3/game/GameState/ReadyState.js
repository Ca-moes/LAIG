class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        let start = Date.now()
        let reply = this.orchestrator.prolog.canPickTile(tile)
        console.log("canPickTile(): " + (Date.now() - start).toString())

        if (reply === 0) {
            start = Date.now()
            tile.pickPiece()
            tile.highlightTile()
            this.orchestrator.startPicking(tile)
            console.log("startPicking(): " + (Date.now() - start).toString())

            // highlight possible movements
            start = Date.now()
            let reply = this.orchestrator.prolog.getPossibleTiles(tile)
            console.log("getPossibleTiles(): " + (Date.now() - start).toString())

            start = Date.now()
            if (reply instanceof Array) this.orchestrator.gameboard.highlightEnemyTiles(reply)
            console.log("highlightTiles(): " + (Date.now() - start).toString())

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
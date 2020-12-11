class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    pickTile(tile) {
        this.orchestrator.prolog.canPickTile(tile, this, (reply) => {
            if (reply === 0) {
                tile.pickPiece()
                tile.highlightTile()
                this.orchestrator.startPicking(tile)
                this.orchestrator.prolog.getPossibleTiles(tile, this, (tiles) => {
                    if (tiles instanceof Array) this.orchestrator.gameboard.highlightEnemyTiles(tiles)
                    this.orchestrator.changeState(new MoveState(this.orchestrator))
                })
            }
        })
    }

    animationEnd() {
        // do nothing, as no animation should be happening here
    }
}
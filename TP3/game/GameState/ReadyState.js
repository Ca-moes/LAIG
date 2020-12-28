class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        if (orchestrator.currentPlayer.type !== Players.HUMAN) {
            this.pickTile = (_) => {
                console.log("Bot move, can't pick")
            }
            this.orchestrator.prolog.getBotNextMove(this, async (reply) => {
                let origin = this.orchestrator.gameboard.getTile(reply[0][0], reply[0][1])
                origin.pickPiece()
                await new Promise(r => setTimeout(r, this.orchestrator.botDelay * 1000));
                let destination = this.orchestrator.gameboard.getTile(reply[1][0], reply[1][1])
                destination.pickPiece()
                this.orchestrator.performBotMove(origin, destination)
                this.orchestrator.changeState(new AnimationState(this.orchestrator))
            })
        }
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

    update(time) {
        if ((time - this.orchestrator.startTime) > this.orchestrator.moveTimeout)
            this.orchestrator.nextTurn()

        this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))
        this.orchestrator.animator.update(time)
    }
}
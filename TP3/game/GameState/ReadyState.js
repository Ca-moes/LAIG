class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        if (orchestrator.currentPlayer.type !== Players.HUMAN) {
            this.orchestrator.scene.interface.removePauseButton()

            this.pickTile = (_) => {
                this.orchestrator.error.log("Bot move, can't pick")
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
        else {
            this.orchestrator.scene.interface.addPauseButton()
        }

        this.normalPicking = (tile) => {
            this.orchestrator.scene.interface.removePauseButton()
            this.orchestrator.prolog.canPickTile(tile, this, (reply) => {
                if (reply === 0) {
                    tile.pickPiece()
                    tile.highlightTile(HighlightColors.BLUE)
                    this.orchestrator.startPicking(tile)
                    this.orchestrator.prolog.getPossibleTiles(tile, this, (tiles) => {
                        if (tiles instanceof Array) this.orchestrator.gameboard.highlightEnemyTiles(tiles)
                        this.orchestrator.changeState(new MoveState(this.orchestrator))
                    })
                } else {
                    this.orchestrator.scene.interface.addPauseButton()
                }
            })
        }

        this.pausePicking = (_) => {
            this.orchestrator.error.log("Cannot Pick While in Pause")
        }
    }

    pickTile(tile) {
        this.normalPicking(tile)
    }

    animationEnd() {
        // do nothing, as no animation should be happening here
    }

    update(time) {
        this.normalUpdate(time)
    }

    continue() {
        this.orchestrator.startTime += Date.now() / 1000 - this.pauseStart
        this.orchestrator.moveStartTime += Date.now() / 1000 - this.pauseStart
        this.update = this.normalUpdate
        this.pickTile = this.normalPicking
    }

    pause() {
        this.pauseStart = Date.now() / 1000
        this.update = this.pauseUpdate
        this.pickTile = this.pausePicking
    }
}
class RemoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        /**
         * If the player is not a person then it processes the bot remove
         */
        if (orchestrator.currentPlayer.type !== Players.HUMAN) {
            this.orchestrator.scene.interface.removePauseButton()

            this.pickTile = (_) => {
                this.orchestrator.error.log("Bot move, can't pick")
            }
            this.orchestrator.prolog.getBotRemoveMove(this, async (reply) => {
                let tile = this.orchestrator.gameboard.getTile(reply[0], reply[1])
                tile.pickPiece()
                tile.highlightTile(HighlightColors.RED)
                await new Promise(r => setTimeout(r, this.orchestrator.botDelay * 1000));

                this.orchestrator.performBotRemove(tile)
                this.orchestrator.changeState(new AnimationState(this.orchestrator))
            })
        }
        else {
            this.orchestrator.scene.interface.addPauseButton()
        }

        /**
         * Normal picking method for when the player is Human
         * @param tile
         */
        this.normalPicking = (tile) => {
            this.orchestrator.scene.interface.removePauseButton()
            this.orchestrator.prolog.canRemovePiece(tile, this, (reply) => {
                if (reply === 0) {
                    tile.pickPiece()
                    tile.highlightTile(HighlightColors.RED)
                    this.orchestrator.startPicking(tile)
                    this.orchestrator.changeState(new ConfirmRemoveState(this.orchestrator))
                } else {
                    this.orchestrator.scene.interface.addPauseButton()
                }
            })
        }

        this.pausePicking = (_) => {
            this.orchestrator.error.log("Cannot Pick While in Pause")
        }
    }

    animationEnd() {
        // theres no animation taking place
    }

    pickTile(tile) {
        this.normalPicking(tile)
    }

    update(time) {
        this.normalUpdate(time)
    }

    /**
     * Method to continue a paused game
     */
    continue() {
        this.orchestrator.startTime += Date.now() / 1000 - this.pauseStart
        this.orchestrator.moveStartTime += Date.now() / 1000 - this.pauseStart
        this.update = this.normalUpdate
        this.pickTile = this.normalPicking
    }

    /**
     * Method to pause the game
     */
    pause() {
        this.pauseStart = Date.now() / 1000
        this.update = this.pauseUpdate
        this.pickTile = this.pausePicking
    }
}
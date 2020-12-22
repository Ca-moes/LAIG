class RemoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        if (orchestrator.currentPlayer.type !== Players.HUMAN) {
            this.pickTile = (_) => {
                console.log("Bot move, can't pick")
            }
            this.orchestrator.prolog.getBotRemoveMove(this, async (reply) => {
                let tile = this.orchestrator.gameboard.getTile(reply[0], reply[1])
                tile.pickPiece()
                tile.highlightTile(false)
                await new Promise(r => setTimeout(r, this.orchestrator.botDelay * 1000));

                this.orchestrator.performBotRemove(tile)
                this.orchestrator.changeState(new AnimationState(this.orchestrator))
            })
        }
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

    update(time) {
        this.orchestrator.theme.updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.animator.update(time)
    }
}
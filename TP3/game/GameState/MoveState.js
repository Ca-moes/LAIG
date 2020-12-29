class MoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    animationEnd() {
        // do nothing here
    }

    pickTile(tile) {
        this.orchestrator.prolog.canMoveToTile(tile, this, (reply) => {
            if (reply === 0) {
                tile.pickPiece()
                this.orchestrator.performMove(tile)
                this.orchestrator.gameboard.disableHighlight()
                this.orchestrator.changeState(new AnimationState(this.orchestrator))
            }
            else if (reply === 1) {
                this.orchestrator.cancelMove()
                this.orchestrator.gameboard.disableHighlight()
                this.orchestrator.changeState(new ReadyState(this.orchestrator))
            }
        })
    }

    update(time) {
        if ((time - this.orchestrator.moveStartTime) > this.orchestrator.moveTimeout) {
            this.orchestrator.cancelMove()
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.nextTurn()
        }

        this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))
        this.orchestrator.hud.updateTimeLeft(Utils.formatTime(this.orchestrator.moveTimeout - time + this.orchestrator.moveStartTime))
        this.orchestrator.animator.update(time)
    }
}

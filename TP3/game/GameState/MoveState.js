class MoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    animationEnd() {
        // do nothing here
    }

    /**
     * Method to process a pickTile event
     * @param {MyTile} tile destination tile
     */
    pickTile(tile) {
        this.orchestrator.prolog.canMoveToTile(tile, this, (reply) => {
            if (reply === 0) {
                tile.pickPiece()
                this.orchestrator.performMove(tile)
                this.orchestrator.gameboard.disableHighlight()
                this.orchestrator.changeState(new AnimationState(this.orchestrator))
            } else if (reply === 1) {
                this.orchestrator.cancelMove()
                this.orchestrator.gameboard.disableHighlight()
                this.orchestrator.changeState(new ReadyState(this.orchestrator))
            }
        })
    }

    /**
     * Method to update the orchestrator's elements, if there's no tine left for the move it
     * passes on to the next player.
     * @param time time in seconds
     */
    update(time) {
        if ((time - this.orchestrator.moveStartTime) > this.orchestrator.moveTimeout) {
            this.orchestrator.cancelMove()
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.nextTurn()
        }

        this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.camera.animate(time)
        this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))
        this.orchestrator.hud.updateTimeLeft(Utils.formatTime(this.orchestrator.moveTimeout - time + this.orchestrator.moveStartTime))
    }

    continue() {

    }

    pause() {

    }
}

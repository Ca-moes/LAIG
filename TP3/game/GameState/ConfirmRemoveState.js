class ConfirmRemoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    animationEnd() {
        // no animation taking place
    }

    /**
     * Process a pickTile event. If the tile is the same as the tile selected before then start
     * to perform the remove. If not, then return to remove state.
     * @param tile
     */
    pickTile(tile) {
        if (tile === this.orchestrator.currentMovement.origTile) {
            this.orchestrator.performMove(tile)
            this.orchestrator.gameboard.disableHighlight()
            this.orchestrator.changeState(new AnimationState(this.orchestrator))
        } else {
            this.orchestrator.cancelMove()
            this.orchestrator.changeState(new RemoveState(this.orchestrator))
        }
    }

    /**
     * Method to update the orchestrator's elements, if there's no tine left for the remove it
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
        // cannot continue on board confirm remove state
    }

    pause() {
        // cannot pause on board confirm remove state
    }
}
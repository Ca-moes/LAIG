class ConfirmRemoveState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    animationEnd() {
        // no animation taking place
    }

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

    continue() {
    }

    pause() {
    }
}
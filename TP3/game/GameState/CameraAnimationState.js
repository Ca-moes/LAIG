class CameraAnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        this.waitingReply = false
    }

    animationEnd() {
        if (!this.waitingReply) {
            this.orchestrator.hud.updateMessage(("Player " + this.orchestrator.currentPlayer.code + " turn").toUpperCase())
            this.orchestrator.custom.log("Player " + this.orchestrator.currentPlayer.code + " turn")
            this.waitingReply = true
            this.orchestrator.prolog.checkFinalState(this, (finalState) => {
                if (finalState === 0) {
                    this.orchestrator.custom.extraInfo("No More Moves for Player " + this.orchestrator.currentPlayer.code)
                    this.orchestrator.changeState(new RemoveState(this.orchestrator))
                } else if (finalState === 1) {
                    this.orchestrator.custom.extraInfo("Moves Available for Player " + this.orchestrator.currentPlayer.code)
                    this.orchestrator.changeState(new ReadyState(this.orchestrator))
                }
            })
        }
    }

    pickTile(tile) {
        // no tile is allowed to be picked at this stage
    }

    update(time) {
        this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.camera.animate(time)
        this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))
    }

    undo() {
        // cannot undo while on camera animation
    }

    continue() {
    }

    pause() {
    }
}
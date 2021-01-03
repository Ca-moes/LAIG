class BoardAnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    /**
     * Starts an Animation for the whole board
     * @param {String} type
     */
    startAnimation(type) {
        if (type === "start")
            this.orchestrator.gameboard.startAppearingAnimation(() => { this.animationEnd() })
        else if (type === "restart")
            this.orchestrator.gameboard.startRestartAnimation(() => { this.orchestrator.onRestartAnimationCompleted() })
        else if (type === "replay")
            this.orchestrator.gameboard.startRestartAnimation(() => { this.orchestrator.onReplayAnimationCompleted() })
    }

    /**
     * After the board animation is done, it changes the state to ready state.
     */
    animationEnd() {
        this.orchestrator.startTime = Date.now() / 1000
        this.orchestrator.moveStartTime = Date.now() / 1000
        this.orchestrator.changeState(new ReadyState(this.orchestrator))
    }

    continue() {
        // cannot continue on board animation state
    }

    pause() {
        // cannot pause on board animation state
    }

    pickTile(tile) {
        // cannot pick a tile on board animation state
    }

    update(time) {
        // calls the update (paused version of it so the time is not changed)
        this.pauseUpdate(time)
    }
}

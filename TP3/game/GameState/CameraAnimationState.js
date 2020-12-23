class CameraAnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        // remove this
        // this.animationEnd()
    }

    animationEnd() {
        this.orchestrator.prolog.checkFinalState(this, (finalState) => {
            if (finalState === 0) {
                console.log("No More Moves for Player " + this.orchestrator.currentPlayer.code)
                this.orchestrator.changeState(new RemoveState(this.orchestrator))
            }
            else if (finalState === 1) {
                console.log("Moves Available for Player " + this.orchestrator.currentPlayer.code)
                this.orchestrator.changeState(new ReadyState(this.orchestrator))
            }
        })
    }

    pickTile(tile) {
        // no tile is allowed to be picked at this stage
    }

    update(time) {
        this.orchestrator.theme.updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.camera.animate(time)
        this.orchestrator.animator.update(time)
    }

    undo() {
        // cannot undo while on camera animation
    }
}
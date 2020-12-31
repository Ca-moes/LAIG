class BoardAnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    startAnimation(type) {
        if (type === "start")
            this.orchestrator.gameboard.startAppearingAnimation(() => { this.animationEnd() })

    }

    animationEnd() {
        this.orchestrator.changeState(new ReadyState(this.orchestrator))
    }

    continue() {

    }

    pause() {

    }

    pickTile(tile) {

    }

    update(time) {
        this.normalUpdate(time)
    }
}

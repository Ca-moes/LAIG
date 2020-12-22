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
        this.orchestrator.theme.updateAnimations(time);
        this.orchestrator.gameboard.update(time)
        this.orchestrator.animator.update(time)
    }
}

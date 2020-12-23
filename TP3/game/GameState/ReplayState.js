class ReplayState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        this.orchestrator.scene.interface.removeReplayButton()

        this.movements = orchestrator.gameSequence.moves.map(a => a.clone())
        this.movements.reverse()

        this.orchestrator.gameboard = this.orchestrator.gameSequence.moves[0].gameboard.clone()

        this.orchestrator.gameboard.auxiliaryBoard.emptyBoard()
        this.nextMove()
    }

    nextMove() {
        let move = this.movements.pop()

        let origin = this.orchestrator.gameboard.getTile(move.origin.x, move.origin.y)
        let destination = this.orchestrator.gameboard.getTile(move.destination.x, move.destination.y)
        origin.pickPiece()
        destination.pickPiece()

        this.orchestrator.currentMovement = new MyGameMove(origin, destination, this.orchestrator.gameboard)
        this.orchestrator.currentMovement.processAnimations(this.orchestrator.gameboard.auxiliaryBoard.getNextPieceCoords())
        this.orchestrator.currentMovement.animate(Date.now() / 1000)

        return move
    }

    animationEnd() {
        if (this.movements.length !== 0)
            this.nextMove()
        else
            this.orchestrator.changeState(new GameOverState(this.orchestrator))
    }

    pickTile(tile) {
        // do nothing
    }

    update(time) {
        this.orchestrator.theme.updateAnimations(time);
        this.orchestrator.gameboard.update(time)

        if (this.orchestrator.currentMovement.animationCompleted)
            this.orchestrator.animationEnd()

        this.orchestrator.animator.update(time)
    }
}
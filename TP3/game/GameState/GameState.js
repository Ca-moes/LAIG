/**
 * @abstract
 */
class GameState {
    constructor(orchestrator) {
        this.orchestrator = orchestrator
    }

    /**
     * @abstract
     * Method to handle "picking a tile" event
     * @param {MyTile} tile
     */
    pickTile(tile) {
        throw new Error("Abstract method pickTile()")
    }

    /**
     * @abstract
     * Method to handle "animation" event
     */
    animationEnd() {
        throw new Error("Abstract method animationEnd()")
    }

    /**
     * Method to undo a move
     */
    undo() {
        let move = this.orchestrator.gameSequence.undo()
        if (move != null) {
            this.orchestrator.gameboard.auxiliaryBoard.undo()

            this.orchestrator.gameboard = move.gameboard
            this.orchestrator.gameboard.orchestrator = this.orchestrator

            this.orchestrator.nextTurn()
            console.log("Undo Movement")
        }
    }

    /**
     * @abstract
     * @param time Time
     */
    update(time) {
        throw new Error("Abstract method update()")
    }

    display() {
        this.orchestrator.scene.clearPickRegistration()
        this.orchestrator.themes[this.orchestrator.selectedTheme].displayScene()
        this.orchestrator.hud.display()
        this.orchestrator.gameboard.display()

        this.orchestrator.animator.display()
    }
}
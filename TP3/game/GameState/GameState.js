/**
 * @abstract
 */
class GameState {
    constructor(orchestrator) {
        orchestrator.scene.interface.removePauseButton()
        this.orchestrator = orchestrator

        this.normalUpdate = (time) => {
            if ((time - this.orchestrator.moveStartTime) > this.orchestrator.moveTimeout)
                this.orchestrator.nextTurn()

            this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
            this.orchestrator.gameboard.update(time)
            this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))
            this.orchestrator.hud.updateTimeLeft(Utils.formatTime(this.orchestrator.moveTimeout - time + this.orchestrator.moveStartTime))
        }

        this.pauseUpdate = (time) => {
            this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
            this.orchestrator.gameboard.update(time)
        }
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
            this.orchestrator.custom.log("Undo Movement")
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
        this.orchestrator.gameboard.display()
        this.orchestrator.scene.clearPickRegistration()
        this.orchestrator.hud.display()
    }

    /**
     * @abstract
     */
    pause() {
        throw new Error("Abstract method pause()")
    }

    /**
     * @abstract
     */
    continue() {
        throw new Error("Abstract method pause()")
    }
}
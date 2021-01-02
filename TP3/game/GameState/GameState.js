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
            this.orchestrator.camera.animate(time)
            this.orchestrator.hud.updateTime(Utils.formatTime(time - this.orchestrator.startTime))
            this.orchestrator.hud.updateTimeLeft(Utils.formatTime(this.orchestrator.moveTimeout - time + this.orchestrator.moveStartTime))
        }

        this.pauseUpdate = (time) => {
            this.orchestrator.themes[this.orchestrator.selectedTheme].updateAnimations(time);
            this.orchestrator.gameboard.update(time)
            this.orchestrator.camera.animate(time)
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
        let callback = () => {
            this.orchestrator.gameboard.auxiliaryBoard.undo()
            this.orchestrator.gameboard = move.gameboard
            this.orchestrator.gameboard.updateBoard(this.orchestrator.gameboardProperties)
            this.orchestrator.gameboard.orchestrator = this.orchestrator
            this.orchestrator.nextTurn()
            this.orchestrator.custom.log("Undo Movement")
        }

        let move = this.orchestrator.gameSequence.undo()
        if (move != null) {
            let moveTime = 1 / this.orchestrator.moveSpeed
            let coords = this.orchestrator.gameboard.auxiliaryBoard.currentCoords()
            let movePiece1 = {
                animation: Animations[this.orchestrator.gameboard.orchestrator.moveAnimation],
                initialPosition: [0, 0, 0],
                finalPosition: [move.origTile.x - move.destTile.x, 0, move.origTile.y - move.destTile.y],
                duration: moveTime,
                heightLevels: [{instant: 0, height: 0}, {instant: moveTime / 2, height: 1}, {instant: moveTime, height: 0}]
            }
            let movePiece2 = {
                animation: Animations[this.orchestrator.moveAnimation],
                initialPosition: [0, 0, 0],
                finalPosition: [move.destTile.x - (coords.x + this.orchestrator.gameboard.size * 1.3 - 1), -0.15 - coords.y * 0.2, move.destTile.y - (this.orchestrator.gameboard.size / 2 - 2 + coords.z)],
                duration: moveTime,
                heightLevels: [{instant: 0, height: 0}, {instant: moveTime * 0.2, height: 1.5}, {instant: moveTime * 0.66 , height: 1}, {instant: moveTime, height: -0.15 - coords.y * 0.2}]
            }

            if (this.orchestrator.gameboard.getTile(move.destTile.x, move.destTile.y).piece != null) {
                let piece1 = this.orchestrator.gameboard.getTile(move.destTile.x, move.destTile.y).piece
                let piece2 = this.orchestrator.gameboard.auxiliaryBoard.pieces[this.orchestrator.gameboard.auxiliaryBoard.pieces.length - 1]

                let animation1 = new EasingAnimation(movePiece1, () => { })
                let animation2 = new EasingAnimation(movePiece2, () => callback())

                piece1.startCustomAnimation(animation1, Date.now() / 1000)
                piece2.startCustomAnimation(animation2, Date.now() / 1000 + 0.5)
            }
            else {
                let piece = this.orchestrator.gameboard.auxiliaryBoard.pieces[this.orchestrator.gameboard.auxiliaryBoard.pieces.length - 1]
                let animation = new EasingAnimation(movePiece2, () => callback())
                piece.startCustomAnimation(animation, Date.now() / 1000)
            }
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
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
     * @abstract
     * Method to undo a move
     */
    undo() {
        throw new Error("Abstract method undo()")
    }

    /**
     * @abstract
     * @param time Time
     */
    update(time) {
        throw new Error("Abstract method update()")
    }
}
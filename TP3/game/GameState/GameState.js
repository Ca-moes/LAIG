class GameState {
    constructor(orchestrator) {
        this.orchestrator = orchestrator
    }

    /**
     * @abstract
     * Method to handle "picking a tile" event
     * @param {MyTile} tile
     */
    pickValidTile(tile) {
        throw new Error("Abstract method pickValidTile()")
    }

    /**
     * @abstract
     * @param {MyTile} tile
     */
    pickInvalidTile(tile) {
        throw new Error("Abstract method pickInvalidTile()")
    }

    /**
     * @abstract
     * Method to handle "animation" event
     */
    animationEnd() {
        throw new Error("Abstract method animationEnd()")
    }
}
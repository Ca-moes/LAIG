/**
 * @abstract
 */
class TileState {
    constructor(tile) {
        this.tile = tile
    }

    /**
     * @abstract
     * @param t
     */
    update(t) {

    }

    /**
     * @abstract
     */
    display() {

    }

    /**
     * @abstract
     */
    highlightTile(color) {

    }

    /**
     * @abstract
     */
    disableHighlight() {

    }
}
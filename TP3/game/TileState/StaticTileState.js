class StaticTileState extends TileState {
    constructor(tile) {
        super(tile);
    }


    disableHighlight() {
        // do nothing as no highlight animation should be present
    }

    /**
     * Display Tile without any animation
     */
    display() {
        this.tile.scene.pushMatrix()

        this.tile.gameboard.orchestrator.tileMaterial.apply()
        if (this.tile.texture)
            this.tile.texture.bind()

        this.tile.obj.display()

        this.tile.scene.popMatrix()

        if (this.tile.piece) {
            this.tile.piece.display()
        }
    }

    /**
     * Highlights a tile with a color
     * @param {HighlightColors} color
     */
    highlightTile(color) {
        this.tile.highlightColor = color
        this.tile.changeState(new HighlightedTileState(this.tile))
    }

    /**
     * Updates this tile's piece if there's one
     * @param t time in seconds
     */
    update(t) {
        if (this.tile.piece) this.tile.piece.update(t)
    }
}
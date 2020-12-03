class StaticTIleState extends TileState {
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

        this.tile.material.apply()
        if (this.tile.texture)
            this.tile.texture.bind()

        this.tile.obj.display()

        this.tile.scene.popMatrix()

        if (this.tile.piece) {
            this.tile.piece.display()
        }
    }

    highlightTile() {
        this.tile.changeState(new HighlightedTileState(this.tile))
    }

    update(t) {
        if (this.tile.piece) this.tile.piece.update(t)
    }
}
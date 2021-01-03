class HighlightedTileState extends TileState {
    constructor(props) {
        super(props);
    }


    /**
     * Disables the highlight for the tile
     */
    disableHighlight() {
        this.tile.changeState(new StaticTileState(this.tile))
    }

    /**
     * Displays a tile with highlighting
     */
    display() {
        this.tile.scene.pushMatrix()

        this.tile.scene.setActiveShaderSimple(this.tile.scene.tileHighlightingShader)
        this.tile.scene.tileHighlightingShader.setUniformsValues({colors: this.tile.highlightColor})

        this.tile.gameboard.orchestrator.tileMaterial.apply()
        if (this.tile.texture)
            this.tile.texture.bind()

        this.tile.obj.display()

        this.tile.scene.setActiveShader(this.tile.scene.defaultShader)

        this.tile.scene.popMatrix()

        if (this.tile.piece)
            this.tile.piece.display()
    }

    highlightTile(color) {
        // tile is already highlighted
    }

    /**
     * Only tiles containing pieces should be highlighted on our game
     * as no other movement is allowed
     * But tiles on the solution path can be highlighted too
     * @param t time in seconds
     */
    update(t) {
        if (this.tile.piece)
            this.tile.piece.update(t)
        this.tile.scene.tileHighlightingShader.setUniformsValues({timeFactor: t * 10 % 1000})
    }
}
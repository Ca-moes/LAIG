class HighlightedTileState extends TileState {
    constructor(props) {
        super(props);
    }


    disableHighlight() {
        this.tile.changeState(new StaticTileState(this.tile))
    }

    display() {
        this.tile.scene.pushMatrix()

        this.tile.scene.setActiveShaderSimple(this.tile.scene.tileHighlightingShader)
        this.tile.scene.tileHighlightingShader.setUniformsValues({colors: this.tile.highlightColor})

        this.tile.material.apply()
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
     * Theoretically only tiles containing pieces should be highlighted on our game
     * as no other movement is allowed
     * @param t
     */
    update(t) {
        if (this.tile.piece)
            this.tile.piece.update(t)
        this.tile.scene.tileHighlightingShader.setUniformsValues({timeFactor: t * 10 % 1000})
    }
}
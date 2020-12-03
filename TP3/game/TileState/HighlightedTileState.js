class HighlightedTileState extends TileState {
    constructor(props) {
        super(props);
    }


    disableHighlight() {
        this.tile.changeState(new StaticTIleState(this.tile))
    }

    display() {
        this.tile.scene.pushMatrix()

        this.tile.scene.setActiveShader(this.tile.scene.tileHighlightingShader)

        this.tile.material.apply()
        if (this.tile.texture)
            this.tile.texture.bind()

        this.tile.obj.display()

        this.tile.scene.setActiveShader(this.tile.scene.defaultShader)

        this.tile.scene.popMatrix()

        this.tile.piece.display()
    }

    highlightTile() {
        // tile is already highlighted
    }

    /**
     * Theoretically only tiles containing pieces should be highlighted on our game
     * as no other movement is allowed
     * @param t
     */
    update(t) {
        this.tile.piece.update(t)
        this.tile.scene.tileHighlightingShader.setUniformsValues({timeFactor: t * 10 % 1000})
    }
}
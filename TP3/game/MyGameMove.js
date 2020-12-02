class MyGameMove {
    /**
     * Constructor of MyGameMove
     * @param piece         {MyPiece}       a pointer to a piece
     * @param origTile      {MyTile}        a pointer to the original tile
     * @param destTile      {MyTile}        a pointer to the destination tile
     * @param gameboard     {MyGameBoard}   a pointer to the GameBoard
     */
    constructor(origTile, destTile, gameboard) {
        this.origTile = origTile
        this.destTile = destTile
        this.gameboard = gameboard

        this.animationCompleted = false

        this.moveAnimation = new KeyframeAnimation([
            {
                instant: 0,
                translation: vec3.fromValues(0, 0, 0),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.1,
                translation: vec3.fromValues((this.destTile.x - this.origTile.x) / 5, 0.33, (-this.destTile.y + this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.2,
                translation: vec3.fromValues(2 * (this.destTile.x - this.origTile.x) / 5, 0.5, 2 * (-this.destTile.y + this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.3,
                translation: vec3.fromValues(3 * (this.destTile.x - this.origTile.x) / 5, 0.5, 3 * (-this.destTile.y + this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.4,
                translation: vec3.fromValues(4 * (this.destTile.x - this.origTile.x) / 5, 0.33, 4 * (-this.destTile.y + this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.5,
                translation: vec3.fromValues(this.destTile.x - this.origTile.x, 0,-this.destTile.y + this.origTile.y),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
        ])
        this.removeAnimation = new KeyframeAnimation([
            {
                instant: 0,
                translation: vec3.fromValues(0, 0, 0),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.1,
                translation: vec3.fromValues(0, 0.20, 0),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.2,
                translation: vec3.fromValues(0, 0.20, 0),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(0, 0, 0)
            },
        ])
    }

    /**
     * Method to animate a game movement
     */
    animate(t) {
        this.origTile.getPiece().startAnimation(this, this.moveAnimation, t, "move")
        this.destTile.getPiece().startAnimation(this, this.removeAnimation, t, "remove")
    }

    notifyMoveAnimationCompleted(type) {
        if (type === "move") {
            this.origTile.getPiece().stopAnimation()
            this.destTile.getPiece().stopAnimation()

            this.animationCompleted = true
            this.gameboard.movePiece(this.origTile, this.destTile)
        }
    }
}
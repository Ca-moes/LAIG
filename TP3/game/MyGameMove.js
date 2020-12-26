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
    }

    setCoordinates(origin, destination) {
        this.origin = {x: origin.x, y: origin.y}
        this.destination = {x: destination.x, y: destination.y}
    }

    /**
     * This method could in theory be inside the constructor,
     * but we are creating this MyGameMove with 2 steps, first we assign the origin tile
     * then we assign the destination tile, so we can't calculate a trajectory when the
     * this object is instantiated. We call this method when the object is fully assigned
     */
    processAnimations(coords) {
        this.moveAnimation = new KeyframeAnimation([
            {
                instant: 0,
                translation: vec3.fromValues(0, 0, 0),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.1,
                translation: vec3.fromValues((this.destTile.x - this.origTile.x) / 5, 0.33, (this.destTile.y - this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.2,
                translation: vec3.fromValues(2 * (this.destTile.x - this.origTile.x) / 5, 0.5, 2 * (this.destTile.y - this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.3,
                translation: vec3.fromValues(3 * (this.destTile.x - this.origTile.x) / 5, 0.5, 3 * (this.destTile.y - this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.4,
                translation: vec3.fromValues(4 * (this.destTile.x - this.origTile.x) / 5, 0.33, 4 * (this.destTile.y - this.origTile.y) / 5),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.5,
                translation: vec3.fromValues(this.destTile.x - this.origTile.x, 0, this.destTile.y - this.origTile.y),
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
                translation: vec3.fromValues((coords.x + this.gameboard.size * 1.3 - 1 - this.destTile.x) / 10, 1, ((this.gameboard.size/2 - 2 + coords.z) - this.destTile.y) / 10),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.3,
                translation: vec3.fromValues(3 * (coords.x + this.gameboard.size * 1.3 - 1 - this.destTile.x) / 10, 1.5, 3 * ((this.gameboard.size/2 - 2 + coords.z) - this.destTile.y) / 10),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.7,
                translation: vec3.fromValues(7 * (coords.x + this.gameboard.size * 1.3 - 1 - this.destTile.x) / 10, 1.5, 7 * ((this.gameboard.size/2 - 2 + coords.z) - this.destTile.y) / 10),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 0.9,
                translation: vec3.fromValues(9 * (coords.x + this.gameboard.size * 1.3 - 1 - this.destTile.x) / 10, 1.5, 9 * ((this.gameboard.size/2 - 2 + coords.z) - this.destTile.y) / 10),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 1,
                translation: vec3.fromValues(coords.x + this.gameboard.size * 1.3 - 1 - this.destTile.x, 1.5, (this.gameboard.size/2 - 2 + coords.z) - this.destTile.y),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
            {
                instant: 1.2,
                translation: vec3.fromValues(coords.x + this.gameboard.size * 1.3 - 1 - this.destTile.x, 0.15 + coords.y*0.2, ((this.gameboard.size/2 - 2 + coords.z) - this.destTile.y)),
                rotation: vec3.fromValues(0, 0, 0),
                scale: vec3.fromValues(1, 1, 1)
            },
        ])
    }

    /**
     * Method to animate a game movement
     */
    animate(t) {
        if (this.origTile === this.destTile) {
            this.destTile.getPiece().startAnimation(this, this.removeAnimation, t, "move")
        }
        else {
            this.origTile.getPiece().startAnimation(this, this.moveAnimation, t, "move")
            this.destTile.getPiece().startAnimation(this, this.removeAnimation, t, "remove")
        }
    }

    /**
     * Method to answer a notification for when animation is completed
     * @param {string} type type of animation {move|remove}
     */
    notifyMoveAnimationCompleted(type) {
        if (type === "remove" || this.destTile === this.origTile) {
            this.origTile.getPiece().stopAnimation()
            this.destTile.getPiece().stopAnimation()

            this.animationCompleted = true
            this.gameboard.movePiece(this.origTile, this.destTile)
            this.setCoordinates(this.origTile, this.destTile)
        }
    }

    clone() {
        let move = new MyGameMove(null, null, this.gameboard.clone())
        let origin = new MyTile(this.origTile.scene, move.gameboard, this.origTile.x, this.origTile.y, this.origTile.material, this.origTile.texture)
        let destination = new MyTile(this.destTile.scene, move.gameboard, this.destTile.x, this.destTile.y, this.destTile.material, this.destTile.texture)

        if (this.origTile.piece) {
            let piece = new MyPiece(this.origTile.scene, this.origTile.piece.player, this.origTile.piece.texture)
            origin.setPiece(piece)
        }
        if (this.destTile.piece) {
            let piece = new MyPiece(this.destTile.scene, this.destTile.piece.player, this.destTile.piece.texture)
            destination.setPiece(piece)
        }

        move.origTile = origin
        move.destTile = destination

        move.setCoordinates(origin, destination)

        return move
    }
}
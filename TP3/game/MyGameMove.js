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
        let moveTime = 1 / this.gameboard.orchestrator.moveSpeed
        let removeTime = moveTime * 1.75 / this.gameboard.orchestrator.moveSpeed

        this.moveAnimationAux = {
            animation: Animations[this.gameboard.orchestrator.moveAnimation],
            initialPosition: [0, 0.1, 0],
            finalPosition: [this.destTile.x - this.origTile.x, 0, this.destTile.y - this.origTile.y],
            duration: moveTime,
            heightLevels: [{instant: 0, height: 0.1}, {instant: moveTime * 0.5, height: 0.66}, {instant: moveTime, height: 0}]
        }

        this.moveAnimation = new EasingAnimation(this.moveAnimationAux, () => { this.notifyMoveAnimationCompleted("move") })

        this.removeAnimationAux = {
            animation: Animations[this.gameboard.orchestrator.moveAnimation],
            initialPosition: [0, 0, 0],
            finalPosition: [coords.x + this.gameboard.size * 1.3 - 1 - this.destTile.x, 0.15 + coords.y * 0.2, ((this.gameboard.size / 2 - 2 + coords.z) - this.destTile.y)],
            duration: removeTime,
            heightLevels: [{instant: 0, height: 0}, {instant: removeTime * 0.3333, height: 1.5}, {instant: removeTime * 0.90 , height: 1.5}, {instant: removeTime, height: 0.15 + coords.y * 0.2}]
        }

        this.removeAnimation = new EasingAnimation(this.removeAnimationAux, () => { this.notifyMoveAnimationCompleted("remove") })
    }

    /**
     * Method to animate a game movement
     */
    animate(t) {
        if (this.origTile === this.destTile) {
            this.destTile.getPiece().startAnimation(this, this.removeAnimation, t, "move")
        } else {
            this.origTile.getPiece().startAnimation(this, this.moveAnimation, t + 0.2 / this.gameboard.orchestrator.moveSpeed, "move")
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

            let clone = this.gameboard.clone()
            this.gameboard.movePiece(this.origTile, this.destTile)
            this.gameboard = clone

            this.setCoordinates(this.origTile, this.destTile)
        }
    }

    clone() {
        let move = new MyGameMove(null, null, this.gameboard.clone())
        let origin = new MyTile(this.origTile.scene, move.gameboard, this.origTile.x, this.origTile.y, this.origTile.material, this.origTile.texture)
        let destination = new MyTile(this.destTile.scene, move.gameboard, this.destTile.x, this.destTile.y, this.destTile.material, this.destTile.texture)

        if (this.origTile.piece) {
            let piece = new MyPiece(this.origTile.scene, this.origTile.piece.player)
            origin.setPiece(piece)
        }
        if (this.destTile.piece) {
            let piece = new MyPiece(this.destTile.scene, this.destTile.piece.player)
            destination.setPiece(piece)
        }

        move.origTile = origin
        move.destTile = destination

        move.setCoordinates(origin, destination)

        return move
    }
}
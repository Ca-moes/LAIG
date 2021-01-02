class MyBoardAnimator {
    constructor(gameboard) {
        this.gameboard = gameboard

        this.animationsDone = 0
        this.totalAnimations = gameboard.size * gameboard.size
    }

    startAppearingAnimation(callback) {
        let i = 0
        for (let y = 0; y < this.gameboard.size; y++) {
            for (let x = 0; x < this.gameboard.size; x++) {
                if (this.gameboard.board[i].piece) {
                    let piece = this.gameboard.board[i].piece
                    let tile = this.gameboard.board[i]

                    let x0 = (x < this.gameboard.size / 2) ? -1 - tile.x : tile.x + 1
                    let y0 = -1
                    let z0 = (y < this.gameboard.size / 2) ? -1 - tile.y : tile.y + 1

                    let time = Math.random() * 2 + 1

                    let moveAnimationAux = {
                        animation: Animations[this.gameboard.orchestrator.moveAnimation],
                        initialPosition: [x0, y0, z0],
                        finalPosition: [0, 0, 0],
                        duration: time,
                        heightLevels: [{instant: 0, height: -1}, {instant: time / 2, height: 1}, {instant: time, height: 0}]
                    }

                    let animation = new EasingAnimation(moveAnimationAux, () => {
                        piece.stopAnimation()
                        this.onAnimationEnd(callback)
                    })

                    piece.startCustomAnimation(animation, Date.now() / 1000)
                } else {
                    this.animationsDone++
                }
                i++
            }
        }
    }

    startRestartAnimation(callback) {
        this.gameboard.disableHighlight()

        let i = 0
        for (let y = 0; y < this.gameboard.size; y++) {
            for (let x = 0; x < this.gameboard.size; x++) {
                if (this.gameboard.board[i].piece) {
                    let piece = this.gameboard.board[i].piece
                    let tile = this.gameboard.board[i]

                    piece.reset()

                    let time = Math.random() + 1

                    let moveAnimationAux = {
                        animation: Animations[this.gameboard.orchestrator.moveAnimation],
                        initialPosition: [0, 0, 0],
                        finalPosition: [piece.originalX - tile.x, 0, piece.originalY - tile.y],
                        duration: time,
                        heightLevels: [{instant: 0, height: 0}, {instant: time / 2, height: 1}, {instant: time, height: 0}]
                    }

                    let animation = new EasingAnimation(moveAnimationAux, () => {
                        this.onAnimationEnd(callback)
                    })

                    piece.startCustomAnimation(animation, Date.now() / 1000)
                }
                i++
            }
        }
        let aux = new MyAuxiliaryBoard(this.gameboard.scene, this.gameboard)

        for (let j = 0; j < this.gameboard.auxiliaryBoard.pieces.length; j++) {
            let piece = this.gameboard.auxiliaryBoard.pieces[j]

            piece.reset()

            let time = Math.random() * 2 + 1
            let coords = aux.getNextPieceCoords()

            let moveAnimationAux = {
                animation: Animations[this.gameboard.orchestrator.moveAnimation],
                initialPosition: [0, 0, 0],
                finalPosition: [piece.originalX - (coords.x + this.gameboard.size * 1.3 - 1), -0.15 - coords.y * 0.2, piece.originalY - (this.gameboard.size / 2 - 2 + coords.z)],
                duration: time,
                heightLevels: [{instant: 0, height: 0}, {instant: time * 0.2, height: 1.5}, {instant: time * 0.66 , height: 1}, {instant: time, height: -0.15 - coords.y * 0.2}]
            }

            let animation = new EasingAnimation(moveAnimationAux, () => {
                this.onAnimationEnd(callback)
            })

            aux.addPiece(piece)
            piece.startCustomAnimation(animation, Date.now() / 1000)
        }
        aux = null
    }

    onAnimationEnd(callback) {
        this.animationsDone++
        if (this.animationsDone === this.totalAnimations) {
            this.animationsDone = 0
            callback()
        }
    }
}